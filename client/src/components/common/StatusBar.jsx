// Fixed, reserved status colors - never reused for generic category
// identity elsewhere, per the design system's color rules.
const STATUS_DOT = { good: "bg-emerald-500", warning: "bg-amber-400", critical: "bg-red-500" };

/**
 * Segmented proportion bar (e.g. completed/pending/overdue) using the
 * reserved status palette, with a gap between segments and a text legend
 * so status is never conveyed by color alone.
 * segments: [{ key: 'good'|'warning'|'critical', label, value }]
 */
const StatusBar = ({ segments }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-gray-100">
        {total === 0 ? (
          <div className="h-full w-full" />
        ) : (
          segments
            .filter((s) => s.value > 0)
            .map((s) => (
              <div
                key={s.key}
                className={`h-full ${STATUS_DOT[s.key]}`}
                style={{ width: `${(s.value / total) * 100}%` }}
                title={`${s.label}: ${s.value}`}
              />
            ))
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s.key]}`} />
            <span className="text-gray-600">{s.label}</span>
            <span className="font-medium text-gray-800">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;
