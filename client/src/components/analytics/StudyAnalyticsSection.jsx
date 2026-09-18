import StatCard from "../common/StatCard.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Skeleton from "../common/Skeleton.jsx";
import SkeletonStat from "../common/SkeletonStat.jsx";
import TrendChart from "./TrendChart.jsx";
import ChartCard from "./ChartCard.jsx";
import CategoryBars from "./CategoryBars.jsx";
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Study time" value={formatMinutes(data.totalMinutes)} />
        <StatCard label="Sessions" value={data.sessionCount} />
      </div>

      <ChartCard title="Study rhythm" subtitle="Focused minutes over the last 7 days">
        <TrendChart data={data.trend} color="blue" valueFormatter={(value) => formatMinutes(value)} />
      </ChartCard>

      <ChartCard title="Focus by course" subtitle="Your most studied subjects">
        {data.byCourse.length === 0 ? (
          <EmptyState message="No study sessions in this period yet." />
        ) : (
          <CategoryBars items={data.byCourse} labelKey="courseName" valueKey="minutes" valueFormatter={formatMinutes} colors={["bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-cyan-500"]} />
        )}
      </ChartCard>
    </div>
  );
};

export default StudyAnalyticsSection;
