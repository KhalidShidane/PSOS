import StatCard from "../common/StatCard.jsx";
import Skeleton from "../common/Skeleton.jsx";
import { formatMinutes } from "../../utils/studyHelpers.js";

/** Deliberately muted styling - coding stays visually secondary to the
 * academic sections, per the project's stated priorities. */
const CodingAnalyticsSection = ({ data, isLoading }) => {
  if (isLoading) return <Skeleton className="h-24 w-full rounded-xl" />;
  if (!data) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
        Coding (secondary activity)
      </p>
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Coding time" value={formatMinutes(data.totalMinutes)} muted />
        <StatCard label="Sessions" value={data.sessionCount} muted />
        <StatCard label="Projects" value={data.projects.length} muted />
      </div>
    </div>
  );
};

export default CodingAnalyticsSection;
