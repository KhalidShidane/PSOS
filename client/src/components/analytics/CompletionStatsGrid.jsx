import StatCard from "../common/StatCard.jsx";
import RingProgress from "../common/RingProgress.jsx";
import StatusBar from "../common/StatusBar.jsx";
import Skeleton from "../common/Skeleton.jsx";

/** Shared shape for Task and Assignment analytics - same numbers, same
 * layout, so the two sections read as one consistent system. */
const CompletionStatsGrid = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:col-span-1">
        <RingProgress value={data.completionRate} max={100} size={72} strokeWidth={7} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Completion rate</p>
          <p className="text-xs text-gray-400">all-time</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:col-span-1">
        <StatCard label="Completed" value={data.completed} hint="this period" />
        <StatCard label="Pending" value={data.pending} />
        <StatCard label="Overdue" value={data.overdue} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:col-span-1">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Breakdown</p>
        <StatusBar
          segments={[
            { key: "good", label: "Completed", value: data.completed },
            { key: "warning", label: "Pending", value: data.pending },
            { key: "critical", label: "Overdue", value: data.overdue },
          ]}
        />
      </div>
    </div>
  );
};

export default CompletionStatsGrid;
