/**
 * `icon` and `actionLabel`/`onAction` are optional - existing callers
 * that only pass `message` keep working unchanged. The action only ever
 * wires to a handler the caller already has (e.g. "open the add modal"),
 * never a fabricated one.
 */
const EmptyState = ({ icon: Icon, message, actionLabel, onAction }) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white px-8 py-12 text-center">
    {Icon && (
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
    )}
    <p className="max-w-sm text-sm text-gray-500">{message}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
