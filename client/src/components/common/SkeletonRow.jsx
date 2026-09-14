import Skeleton from "./Skeleton.jsx";

/** Mirrors a TaskItem/AssignmentCard/list-row shape. */
const SkeletonRow = () => (
  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
    <Skeleton className="h-4 w-4 shrink-0 rounded" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3.5 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
  </div>
);

export default SkeletonRow;
