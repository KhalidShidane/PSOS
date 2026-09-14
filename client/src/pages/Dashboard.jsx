import { useDashboard } from "../hooks/useDashboard.js";
import { useTasks } from "../hooks/useTasks.js";
import { useAssignments } from "../hooks/useAssignments.js";
import { useStudyAnalytics } from "../hooks/useStudyAnalytics.js";
import { useTaskAnalytics } from "../hooks/useTaskAnalytics.js";
import { useAssignmentAnalytics } from "../hooks/useAssignmentAnalytics.js";
import { useAuth } from "../hooks/useAuth.js";
import CurrentActivityCard from "../components/dashboard/CurrentActivityCard.jsx";
import NextActivityCard from "../components/dashboard/NextActivityCard.jsx";
import NextPrayerCard from "../components/dashboard/NextPrayerCard.jsx";
import QuickActions from "../components/dashboard/QuickActions.jsx";
import NeedsAttentionCard from "../components/dashboard/NeedsAttentionCard.jsx";
import TodayProgressCard from "../components/dashboard/TodayProgressCard.jsx";
import TodaySchedule from "../components/timetable/TodaySchedule.jsx";
import TrendChart from "../components/analytics/TrendChart.jsx";
import RingProgress from "../components/common/RingProgress.jsx";
import Skeleton from "../components/common/Skeleton.jsx";
import SkeletonStat from "../components/common/SkeletonStat.jsx";
import ErrorState from "../components/common/ErrorState.jsx";

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStat key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      ))}
    </div>
    <Skeleton className="h-40 w-full rounded-xl" />
  </div>
);

/**
 * DOM order: welcome header -> today's progress -> current/next/prayer ->
 * quick actions -> needs attention + today's schedule -> this week. This
 * still matches the spec's mobile priority (current -> next -> prayer ->
 * needs attention -> schedule -> progress) among those five cards - the
 * welcome header and progress row are simply framing above them, mirroring
 * the reference dashboard layout.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, error, refresh } = useDashboard();
  const { tasks } = useTasks();
  const { assignments } = useAssignments();
  const { data: studyTrend } = useStudyAnalytics("weekly");
  const { data: taskWeek } = useTaskAnalytics("weekly");
  const { data: assignmentWeek } = useAssignmentAnalytics("weekly");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-gray-500">Your day at a glance.</p>
      </div>

      {error && <ErrorState message={error} />}

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <TodayProgressCard progress={data.todayProgress} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <CurrentActivityCard activity={data.currentActivity} />
            <NextActivityCard activity={data.nextActivity} now={new Date()} />
            <NextPrayerCard nextPrayer={data.nextPrayer} />
          </div>

          <QuickActions onCreated={refresh} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <NeedsAttentionCard tasks={tasks} assignments={assignments} />
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="mb-2 text-sm font-semibold text-gray-700">Today's schedule</h2>
              <TodaySchedule schedules={data.todaySchedule} />
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-700">This week</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {studyTrend && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Study - last 7 days
                  </p>
                  <TrendChart data={studyTrend.trend} />
                </div>
              )}
              <div className="flex items-center justify-around gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                {taskWeek && (
                  <div className="flex flex-col items-center gap-1">
                    <RingProgress value={taskWeek.completionRate} size={64} strokeWidth={6} />
                    <span className="text-xs text-gray-500">Tasks</span>
                  </div>
                )}
                {assignmentWeek && (
                  <div className="flex flex-col items-center gap-1">
                    <RingProgress value={assignmentWeek.completionRate} size={64} strokeWidth={6} />
                    <span className="text-xs text-gray-500">Assignments</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
