import { useId, useMemo, useState } from "react";

const formatLabel = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { weekday: "short" });
};

/** Responsive SVG area chart, shared by study, finance, and analytics. */
const TrendChart = ({ data = [], valueKey = "minutes", labelKey = "date", color = "emerald", valueFormatter = (value) => value }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const id = useId().replace(/:/g, "");
  const palette = color === "violet" ? { stroke: "#7c3aed", fill: "#ede9fe", dot: "#8b5cf6" } : color === "blue" ? { stroke: "#2563eb", fill: "#dbeafe", dot: "#3b82f6" } : { stroke: "#059669", fill: "#d1fae5", dot: "#10b981" };
  const points = useMemo(() => data.map((item, index) => ({ label: item[labelKey], value: Number(item[valueKey]) || 0, index })), [data, labelKey, valueKey]);

  if (!points.length) return <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">No activity recorded yet</div>;

  const width = 640, height = 210, top = 18, bottom = 36, left = 8, right = 8;
  const max = Math.max(...points.map((point) => point.value), 1);
  const chartHeight = height - top - bottom;
  const step = points.length > 1 ? (width - left - right) / (points.length - 1) : 0;
  const coords = points.map((point, index) => ({ ...point, x: points.length === 1 ? width / 2 : left + step * index, y: top + chartHeight - (point.value / max) * chartHeight }));
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${height - bottom} ${line} ${width - right},${height - bottom}`;
  const active = activeIndex === null ? null : coords[activeIndex];

  return <div className="relative h-56 w-full select-none">
    {active && <div className="absolute left-1/2 top-1 z-10 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"><span className="mr-1.5 text-slate-300">{formatLabel(active.label)}</span>{valueFormatter(active.value)}</div>}
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible" role="img" aria-label="Activity trend chart" onMouseLeave={() => setActiveIndex(null)}>
      <defs><linearGradient id={`fill-${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={palette.stroke} stopOpacity=".28" /><stop offset="100%" stopColor={palette.fill} stopOpacity=".05" /></linearGradient></defs>
      {[0, 0.5, 1].map((lineY) => <line key={lineY} x1={left} x2={width - right} y1={top + chartHeight * lineY} y2={top + chartHeight * lineY} stroke="#e2e8f0" strokeDasharray="4 5" />)}
      <polygon points={area} fill={`url(#fill-${id})`} /><polyline points={line} fill="none" stroke={palette.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((point) => <g key={`${point.label}-${point.index}`} onMouseEnter={() => setActiveIndex(point.index)} className="cursor-pointer"><rect x={point.x - Math.max(step / 2, 24)} y={top} width={Math.max(step, 48)} height={chartHeight} fill="transparent" /><circle cx={point.x} cy={point.y} r={activeIndex === point.index ? 5 : 3.5} fill="white" stroke={palette.dot} strokeWidth="2.5" /><text x={point.x} y={height - 11} textAnchor="middle" fill="#94a3b8" fontSize="11">{formatLabel(point.label)}</text></g>)}
    </svg>
  </div>;
};

export default TrendChart;
