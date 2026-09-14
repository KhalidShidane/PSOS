import Skeleton from "./Skeleton.jsx";

/** Mirrors StatCard's shape (icon circle + label + value). */
const SkeletonStat = () => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-2.5 w-16" />
      <Skeleton className="h-5 w-12" />
    </div>
  </div>
);

export default SkeletonStat;
