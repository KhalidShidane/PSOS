/** Simple segmented control - e.g. the Daily/Weekly/Monthly analytics toggle. */
const Tabs = ({ options, value, onChange }) => (
  <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
          value === opt.value ? "bg-emerald-600 text-white" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default Tabs;
