import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useWeeklyAnalytics } from "../hooks/useWeeklyAnalytics.js";
import { useWeeklyReviews } from "../hooks/useWeeklyReviews.js";
import StatCard from "../components/common/StatCard.jsx";
import Skeleton from "../components/common/Skeleton.jsx";
import SkeletonStat from "../components/common/SkeletonStat.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import WeeklyReviewForm from "../components/weeklyReview/WeeklyReviewForm.jsx";

const formatRange = (start, end) =>
  `${new Date(start).toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${new Date(
    end
  ).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

const WeeklyReview = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStartParam = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d.toISOString();
  }, [weekOffset]);

  const { data: summary, isLoading: summaryLoading, error: summaryError } = useWeeklyAnalytics(weekStartParam);
  const { reviews, isLoading: reviewsLoading, addReview, editReview } = useWeeklyReviews();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  const existingReview = summary
    ? reviews.find((r) => new Date(r.weekStart).toDateString() === new Date(summary.weekStart).toDateString())
    : null;

  const handleSubmit = async (reflections) => {
    setIsSubmitting(true);
    setFormError("");
    setSaved(false);
    try {
      const payload = {
        weekStart: summary.weekStart,
        weekEnd: summary.weekEnd,
        studyHours: summary.studyHours,
        codingHours: summary.codingHours,
        completedTasks: summary.completedTasks,
        completedAssignments: summary.completedAssignments,
        ...reflections,
      };
      if (existingReview) {
        await editReview(existingReview._id, payload);
      } else {
        await addReview(payload);
      }
      setSaved(true);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Weekly Review</h1>
          <p className="text-sm text-gray-500">Reflect on the week, backed by your real activity.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 text-sm shadow-sm">
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Previous week"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <span className="min-w-[7.5rem] px-1 text-center font-medium text-gray-700">
            {summary ? formatRange(summary.weekStart, summary.weekEnd) : "..."}
          </span>
          <button
            type="button"
            onClick={() => setWeekOffset((w) => Math.min(0, w + 1))}
            disabled={weekOffset >= 0}
            aria-label="Next week"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {summaryError && <ErrorState message={summaryError} />}

      {summaryLoading || reviewsLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonStat key={i} />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-700">This week's numbers</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Study" value={`${summary.studyHours}h`} />
              <StatCard label="Coding" value={`${summary.codingHours}h`} />
              <StatCard label="Tasks completed" value={summary.completedTasks} />
              <StatCard label="Assignments completed" value={summary.completedAssignments} />
            </div>
          </div>

          {formError && <ErrorState message={formError} />}
          {saved && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              Review saved.
            </p>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <WeeklyReviewForm
              key={existingReview?._id || summary.weekStart}
              defaultValues={{
                achievements: existingReview?.achievements || "",
                challenges: existingReview?.challenges || "",
                improvements: existingReview?.improvements || "",
                nextWeekPlan: existingReview?.nextWeekPlan || "",
              }}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyReview;
