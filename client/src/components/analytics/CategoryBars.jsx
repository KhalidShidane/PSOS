const CategoryBars = ({ items = [], labelKey = "category", valueKey = "amount", valueFormatter = (value) => value, colors = ["bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-violet-500"] }) => {
  if (!items.length) return <div className="flex h-48 items-center justify-center text-sm text-slate-400">No data for this period</div>;
  const max = Math.max(...items.map((item) => Number(item[valueKey]) || 0), 1);
  return <div className="space-y-4">{items.slice(0, 5).map((item, index) => <div key={`${item[labelKey]}-${index}`}><div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="truncate font-medium text-slate-600">{item[labelKey]}</span><span className="font-semibold tabular-nums text-slate-800">{valueFormatter(item[valueKey])}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${colors[index % colors.length]}`} style={{ width: `${Math.max(5, (item[valueKey] / max) * 100)}%` }} /></div></div>)}</div>;
};
export default CategoryBars;
