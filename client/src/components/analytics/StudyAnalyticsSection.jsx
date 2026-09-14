import StatCard from "../common/StatCard.jsx";
import ProgressBar from "../common/ProgressBar.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Skeleton from "../common/Skeleton.jsx";
import SkeletonStat from "../common/SkeletonStat.jsx";
import TrendChart from "./TrendChart.jsx";
import { formatMinutes } from "../../utils/studyHelpers.js";

const StudyAnalyticsSection = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SkeletonStat />
          <SkeletonStat />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }
  if (!data) return null;

  const maxCourseMinutes = Math.max(...data.byCourse.map((c) => c.minutes), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Study time" value={formatMinutes(data.totalMinutes)} />
        <StatCard label="Sessions" value={data.sessionCount} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Last 7 days</h3>
        <TrendChart data={data.trend} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">By course</h3>
        {data.byCourse.length === 0 ? (
          <EmptyState message="No study sessions in this period yet." />
        ) : (
          <ul className="space-y-2">
            {data.byCourse.map((c) => (
              <li key={c.courseId || "none"} className="text-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="truncate font-medium text-gray-700">{c.courseName}</span>
                  <span className="shrink-0 text-gray-500">{formatMinutes(c.minutes)}</span>
                </div>
                <ProgressBar value={c.minutes} max={maxCourseMinutes} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudyAnalyticsSection;
