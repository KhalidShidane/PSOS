import mongoose from "mongoose";
import Schedule, { DAYS_OF_WEEK } from "../models/Schedule.js";
import StudySession from "../models/StudySession.js";
import CodingSession from "../models/CodingSession.js";
import Task from "../models/Task.js";
import Assignment from "../models/Assignment.js";
import Course from "../models/Course.js";
import PrayerSchedule from "../models/PrayerSchedule.js";
import Transaction from "../models/Transaction.js";
import { resolvePeriodRange, last7DaysRange, startOfAcademicWeek, endOfAcademicWeek } from "../utils/dateRanges.js";

const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const dayNameOf = (date) => DAYS_OF_WEEK[(date.getDay() + 6) % 7]; // getDay(): 0=Sun -> DAYS_OF_WEEK starts Monday

const getActivityStatus = (schedule, now) => {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(schedule.startTime);
  const end = timeToMinutes(schedule.endTime);
  if (nowMinutes < start) return "upcoming";
  if (nowMinutes >= end) return "completed";
  return "current";
};

const getCurrentAndNextPrayer = (schedule, now) => {
  if (!schedule) return null;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const prayers = PRAYER_ORDER.map((key) => ({ key, minutes: timeToMinutes(schedule[key]) })).sort(
    (a, b) => a.minutes - b.minutes
  );

  let next = prayers[0];
  let minutesRemaining = 1440 - nowMinutes + next.minutes;

  for (const prayer of prayers) {
    if (nowMinutes < prayer.minutes) {
      next = prayer;
      minutesRemaining = prayer.minutes - nowMinutes;
      break;
    }
  }

  return { name: next.key, time: schedule[next.key], minutesRemaining };
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

const getDashboard = async (userId) => {
  const now = new Date();
  const today = dayNameOf(now);
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setHours(23, 59, 59, 999);

  const [todaySchedulesRaw, prayerSchedule, tasksCompletedToday, assignmentsCompletedToday, studySessionsToday] =
    await Promise.all([
      Schedule.find({ user: userId, dayOfWeek: today }).sort({ startTime: 1 }),
      PrayerSchedule.findOne({ user: userId, isDefault: true }),
      Task.countDocuments({ user: userId, status: "Completed", completedAt: { $gte: dayStart, $lte: dayEnd } }),
      // Assignment has no completedAt field - updatedAt is the best available
      // signal for "completed today" since it changes when status flips.
      Assignment.countDocuments({
        user: userId,
        status: "Completed",
        updatedAt: { $gte: dayStart, $lte: dayEnd },
      }),
      StudySession.find({ user: userId, startTime: { $gte: dayStart, $lte: dayEnd } }, "duration"),
    ]);

  const todaySchedule = todaySchedulesRaw.map((s) => ({
    ...s.toObject(),
    status: getActivityStatus(s, now),
  }));

  const currentActivity = todaySchedule.find((s) => s.status === "current") || null;
  const nextActivity = todaySchedule.find((s) => s.status === "upcoming") || null;
  const nextPrayer = getCurrentAndNextPrayer(prayerSchedule, now);

  const studyMinutesToday = studySessionsToday.reduce((sum, s) => sum + (s.duration || 0), 0);
  const completedScheduleToday = todaySchedule.filter((s) => s.status === "completed").length;

  return {
    currentActivity,
    nextActivity,
    nextPrayer,
    todaySchedule,
    todayProgress: {
      tasksCompleted: tasksCompletedToday,
      assignmentsCompleted: assignmentsCompletedToday,
      studyMinutes: studyMinutesToday,
      scheduleCompletion: { completed: completedScheduleToday, total: todaySchedule.length },
    },
  };
};

// ---------------------------------------------------------------------------
// Study analytics
// ---------------------------------------------------------------------------

const getStudyAnalytics = async (userId, period) => {
  const { start, end } = resolvePeriodRange(period);
  const trendRange = last7DaysRange();
  const uid = new mongoose.Types.ObjectId(userId);

  const [totals, byCourse, trendRaw] = await Promise.all([
    StudySession.aggregate([
      { $match: { user: uid, startTime: { $gte: start, $lte: end }, duration: { $ne: null } } },
      { $group: { _id: null, totalMinutes: { $sum: "$duration" }, sessionCount: { $sum: 1 } } },
    ]),
    StudySession.aggregate([
      { $match: { user: uid, startTime: { $gte: start, $lte: end }, duration: { $ne: null } } },
      { $group: { _id: "$course", minutes: { $sum: "$duration" } } },
      { $sort: { minutes: -1 } },
    ]),
    StudySession.aggregate([
      { $match: { user: uid, startTime: { $gte: trendRange.start, $lte: trendRange.end }, duration: { $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
          minutes: { $sum: "$duration" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const courseIds = byCourse.map((c) => c._id).filter(Boolean);
  const courses = await Course.find({ _id: { $in: courseIds } }, "name");
  const courseNameById = new Map(courses.map((c) => [String(c._id), c.name]));

  return {
    period,
    range: { start, end },
    totalMinutes: totals[0]?.totalMinutes || 0,
    sessionCount: totals[0]?.sessionCount || 0,
    byCourse: byCourse.map((c) => ({
      courseId: c._id,
      courseName: c._id ? courseNameById.get(String(c._id)) || "Unknown course" : "No course",
      minutes: c.minutes,
    })),
    trend: trendRaw.map((t) => ({ date: t._id, minutes: t.minutes })),
  };
};

// ---------------------------------------------------------------------------
// Task / Assignment analytics
// ---------------------------------------------------------------------------

const getTaskAnalytics = async (userId, period) => {
  const { start, end } = resolvePeriodRange(period);
  const now = new Date();

  const [completedInPeriod, pending, overdue, completedAllTime, totalAllTime] = await Promise.all([
    Task.countDocuments({ user: userId, status: "Completed", completedAt: { $gte: start, $lte: end } }),
    Task.countDocuments({ user: userId, status: { $ne: "Completed" } }),
    Task.countDocuments({ user: userId, status: { $ne: "Completed" }, dueDate: { $lt: now } }),
    Task.countDocuments({ user: userId, status: "Completed" }),
    Task.countDocuments({ user: userId }),
  ]);

  return {
    period,
    range: { start, end },
    completed: completedInPeriod,
    pending,
    overdue,
    completionRate: totalAllTime > 0 ? Math.round((completedAllTime / totalAllTime) * 100) : 0,
  };
};

const getAssignmentAnalytics = async (userId, period) => {
  const { start, end } = resolvePeriodRange(period);
  const now = new Date();

  const [completedInPeriod, pending, overdue, completedAllTime, totalAllTime] = await Promise.all([
    // updatedAt is used as the completion timestamp proxy (see getDashboard).
    Assignment.countDocuments({ user: userId, status: "Completed", updatedAt: { $gte: start, $lte: end } }),
    Assignment.countDocuments({ user: userId, status: { $ne: "Completed" } }),
    Assignment.countDocuments({ user: userId, status: { $ne: "Completed" }, deadline: { $lt: now } }),
    Assignment.countDocuments({ user: userId, status: "Completed" }),
    Assignment.countDocuments({ user: userId }),
  ]);

  return {
    period,
    range: { start, end },
    completed: completedInPeriod,
    pending,
    overdue,
    completionRate: totalAllTime > 0 ? Math.round((completedAllTime / totalAllTime) * 100) : 0,
  };
};

// ---------------------------------------------------------------------------
// Coding analytics (secondary activity - kept intentionally light)
// ---------------------------------------------------------------------------

const getCodingAnalytics = async (userId, period) => {
  const { start, end } = resolvePeriodRange(period);
  const uid = new mongoose.Types.ObjectId(userId);

  const [totals, projects] = await Promise.all([
    CodingSession.aggregate([
      { $match: { user: uid, startTime: { $gte: start, $lte: end }, duration: { $ne: null } } },
      { $group: { _id: null, totalMinutes: { $sum: "$duration" }, sessionCount: { $sum: 1 } } },
    ]),
    CodingSession.distinct("project", { user: userId, startTime: { $gte: start, $lte: end } }),
  ]);

  return {
    period,
    range: { start, end },
    totalMinutes: totals[0]?.totalMinutes || 0,
    sessionCount: totals[0]?.sessionCount || 0,
    projects,
  };
};

// ---------------------------------------------------------------------------
// Finance
// ---------------------------------------------------------------------------

const getFinanceAnalytics = async (userId, period) => {
  const { start, end } = resolvePeriodRange(period);
  const trendRange = last7DaysRange();
  const uid = new mongoose.Types.ObjectId(userId);

  const [totalsByType, byCategory, trendRaw] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: uid, date: { $gte: start, $lte: end } } },
      { $group: { _id: "$type", amount: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    Transaction.aggregate([
      { $match: { user: uid, type: "expense", date: { $gte: start, $lte: end } } },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          user: uid,
          type: "expense",
          date: { $gte: trendRange.start, $lte: trendRange.end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totalIncome = totalsByType.find((t) => t._id === "income")?.amount || 0;
  const totalExpenses = totalsByType.find((t) => t._id === "expense")?.amount || 0;
  const transactionCount = totalsByType.reduce((sum, t) => sum + t.count, 0);

  return {
    period,
    range: { start, end },
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactionCount,
    byCategory: byCategory.map((c) => ({ category: c._id || "Other", amount: c.amount })),
    trend: trendRaw.map((t) => ({ date: t._id, amount: t.amount })),
  };
};

// ---------------------------------------------------------------------------
// Course progress
// ---------------------------------------------------------------------------

const getCourseAnalytics = async (userId) => {
  const uid = new mongoose.Types.ObjectId(userId);

  const courses = await Course.find({ user: userId }).sort({ name: 1 });

  const [assignmentStats, studyStats, scheduleCounts] = await Promise.all([
    Assignment.aggregate([
      { $match: { user: uid, course: { $ne: null } } },
      {
        $group: {
          _id: "$course",
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
        },
      },
    ]),
    StudySession.aggregate([
      { $match: { user: uid, course: { $ne: null }, duration: { $ne: null } } },
      { $group: { _id: "$course", minutes: { $sum: "$duration" } } },
    ]),
    Schedule.aggregate([
      { $match: { user: uid, course: { $ne: null } } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]),
  ]);

  const byId = (rows) => new Map(rows.map((r) => [String(r._id), r]));
  const assignmentById = byId(assignmentStats);
  const studyById = byId(studyStats);
  const scheduleById = byId(scheduleCounts);

  // Course-level info only - never an invented grade, since no grade data exists.
  return courses.map((course) => {
    const key = String(course._id);
    const assignments = assignmentById.get(key);
    return {
      courseId: course._id,
      courseName: course.name,
      status: course.status,
      assignmentsCompleted: assignments?.completed || 0,
      assignmentsTotal: assignments?.total || 0,
      studyMinutes: studyById.get(key)?.minutes || 0,
      weeklyClassCount: scheduleById.get(key)?.count || 0,
    };
  });
};

// ---------------------------------------------------------------------------
// Weekly summary (real numbers to pre-fill a Weekly Review)
// ---------------------------------------------------------------------------

const getWeeklyAnalytics = async (userId, weekStartInput) => {
  const anchor = weekStartInput ? new Date(weekStartInput) : new Date();
  const start = startOfAcademicWeek(anchor);
  const end = endOfAcademicWeek(anchor);
  const uid = new mongoose.Types.ObjectId(userId);

  const [studyTotals, codingTotals, completedTasks, completedAssignments] = await Promise.all([
    StudySession.aggregate([
      { $match: { user: uid, startTime: { $gte: start, $lte: end }, duration: { $ne: null } } },
      { $group: { _id: null, minutes: { $sum: "$duration" } } },
    ]),
    CodingSession.aggregate([
      { $match: { user: uid, startTime: { $gte: start, $lte: end }, duration: { $ne: null } } },
      { $group: { _id: null, minutes: { $sum: "$duration" } } },
    ]),
    Task.countDocuments({ user: userId, status: "Completed", completedAt: { $gte: start, $lte: end } }),
    Assignment.countDocuments({ user: userId, status: "Completed", updatedAt: { $gte: start, $lte: end } }),
  ]);

  return {
    weekStart: start,
    weekEnd: end,
    studyHours: Math.round(((studyTotals[0]?.minutes || 0) / 60) * 10) / 10,
    codingHours: Math.round(((codingTotals[0]?.minutes || 0) / 60) * 10) / 10,
    completedTasks,
    completedAssignments,
  };
};

export default {
  getDashboard,
  getStudyAnalytics,
  getTaskAnalytics,
  getAssignmentAnalytics,
  getCodingAnalytics,
  getFinanceAnalytics,
  getCourseAnalytics,
  getWeeklyAnalytics,
};
