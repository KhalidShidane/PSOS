/** Thin progress bar in the brand emerald - shared by study-by-course and
 * course-progress displays so the visual language matches everywhere. */
const ProgressBar = ({ value, max = 100 }) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100">
      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
    </div>
  );
};

export default ProgressBar;
