import ProgressBar from "../common/ProgressBar.jsx";
import EmptyState from "../common/EmptyState.jsx";
import { formatCurrency } from "../../utils/financeHelpers.js";

/** Expense breakdown by category - the most actionable finance view
 * ("where is my money going"), mirroring StudyByCourse's layout. */
const FinanceByCategory = ({ byCategory }) => {
  if (!byCategory || byCategory.length === 0) {
    return <EmptyState message="No expenses in this period yet." />;
  }

  const max = Math.max(...byCategory.map((c) => c.amount));

  return (
    <ul className="space-y-2">
      {byCategory.map((c) => (
        <li key={c.category} className="text-sm">
          <div className="mb-1 flex items-center justify-between">
            <span className="truncate font-medium text-gray-700">{c.category}</span>
            <span className="shrink-0 text-gray-500">{formatCurrency(c.amount)}</span>
          </div>
          <ProgressBar value={c.amount} max={max} />
        </li>
      ))}
    </ul>
  );
};

export default FinanceByCategory;
