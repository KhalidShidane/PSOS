// Single source of truth for schedule/timetable display logic, so the
// weekly timetable, the daily view, and the "today's schedule" component
// (reused later on the Dashboard) all agree on ordering and on what
// counts as the "current" vs "next" activity.

// Display order for the timetable - the university week runs
// Saturday -> Wednesday, with Thursday/Friday free. This is a display
// default only; it does not restrict which day a schedule can be set to
// (the backend accepts any day in DAYS_OF_WEEK).
export const WEEK_ORDER = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

// Defaults used to pre-fill forms and to highlight typical class time in
// the timetable UI. Change these in one place rather than hardcoding the
// values across components.
export const UNIVERSITY_DEFAULTS = {
  days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
  startTime: "07:00",
  endTime: "15:00",
};

// Intl.DateTimeFormat gives us the day name directly, matching the
// Schedule model's dayOfWeek enum strings (e.g. "Saturday").
export const dayNameOf = (date = new Date()) =>
  new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);

export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const sortByStartTime = (schedules) =>
  [...schedules].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

/**
 * Status of a single schedule item relative to "now", assuming the item
 * falls on today. Returns 'current' | 'upcoming' | 'completed'.
 */
export const getActivityStatus = (schedule, now = new Date()) => {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(schedule.startTime);
  const end = timeToMinutes(schedule.endTime);

  if (nowMinutes < start) return "upcoming";
  if (nowMinutes >= end) return "completed";
  return "current";
};

/** Today's schedules, sorted by start time, each annotated with status. */
export const getTodaysSchedules = (schedules, now = new Date()) => {
  const today = dayNameOf(now);
  return sortByStartTime(schedules.filter((s) => s.dayOfWeek === today)).map((s) => ({
    ...s,
    status: getActivityStatus(s, now),
  }));
};

export const getCurrentActivity = (schedules, now = new Date()) =>
  getTodaysSchedules(schedules, now).find((s) => s.status === "current") || null;

export const getNextActivity = (schedules, now = new Date()) =>
  getTodaysSchedules(schedules, now).find((s) => s.status === "upcoming") || null;

export const SCHEDULE_TYPES = [
  "University",
  "Study",
  "Coding",
  "Prayer",
  "Sleep",
  "Break",
  "Meal",
  "Assignment",
  "Other",
];
