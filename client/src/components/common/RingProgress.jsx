/** Single-value ring chart in the brand emerald - used for completion
 * rates and today's schedule progress. Track is neutral gray so the
 * filled arc (the actual data) is the only colored element. */
const RingProgress = ({ value, max = 100, size = 88, strokeWidth = 9, label }) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      title={`${Math.round(pct)}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-emerald-500"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-base font-semibold text-gray-800">
        {label ?? `${Math.round(pct)}%`}
      </span>
    </div>
  );
};

export default RingProgress;
