import Skeleton from "./Skeleton.jsx";

/** Mirrors CourseCard's shape (photo banner + title/meta + footer) so the
 * loading state doesn't visually jump when real content arrives. */
const SkeletonCard = () => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    <Skeleton className="h-28 w-full rounded-none" />
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
