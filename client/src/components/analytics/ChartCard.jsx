import { TrendingUp } from "lucide-react";

const ChartCard = ({ title, subtitle, action, children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60 ${className}`}>
    <div className="mb-5 flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-slate-800">{title}</h3>{subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}</div>{action || <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><TrendingUp className="h-4 w-4" /></span>}</div>
    {children}
  </div>
);
export default ChartCard;
