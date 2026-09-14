/** Minimal CSS bar chart - no charting library needed for a simple, honest
 * 7-point trend. Bar heights are proportional to the data's own max, never
 * to an arbitrary fixed scale, so the chart can't misrepresent the data. */
const TrendChart = ({ data, valueKey = "minutes", labelKey = "date" }) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-500">Not enough data yet.</p>;
  }

  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="flex h-24 items-end gap-2">
      {data.map((d) => (
        <div key={d[labelKey]} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-emerald-500"
            style={{ height: `${Math.max(4, (d[valueKey] / max) * 96)}px` }}
            title={`${d[labelKey]}: ${d[valueKey]}`}
          />
          <span className="text-[10px] text-gray-400">
            {new Date(d[labelKey]).toLocaleDateString(undefined, { weekday: "short" })}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TrendChart;
