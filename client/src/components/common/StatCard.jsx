const ICON_TONES = {
  emerald: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
  gray: "bg-gray-100 text-gray-600",
};

/** Reusable stat tile used across the Dashboard and Analytics pages.
 * `icon` is optional - when passed, it's shown in a colored circle
 * beside the label/value. `tone` picks that circle's color and defaults
 * to emerald (the brand color), so every existing usage is unaffected -
 * only call sites that need a different semantic (e.g. "red" for an
 * expenses stat) pass it explicitly. */
const StatCard = ({ label, value, hint, icon: Icon, tone = "emerald", muted = false }) => (
  <div
    className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${muted ? "opacity-80" : ""}`}
  >
    {Icon && (
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ICON_TONES[tone] || ICON_TONES.emerald}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
    )}
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold text-gray-800">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
    </div>
  </div>
);

export default StatCard;
