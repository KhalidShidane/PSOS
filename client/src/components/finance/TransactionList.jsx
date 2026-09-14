import { sortTransactionsRecent, formatCurrency } from "../../utils/financeHelpers.js";

const TransactionList = ({ transactions, onEdit, onDelete, limit }) => {
  const sorted = sortTransactionsRecent(transactions);
  const items = limit ? sorted.slice(0, limit) : sorted;

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No transactions yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li
          key={t._id}
          className="flex items-center justify-between gap-3 rounded-md border border-gray-100 px-3 py-2 text-sm"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-800">
              {t.description || t.category}
            </p>
            <p className="truncate text-xs text-gray-500">
              {new Date(t.date).toLocaleDateString()} · {t.category}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span
              className={`font-semibold tabular-nums ${
                t.type === "income" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {t.type === "income" ? "+" : "-"}
              {formatCurrency(t.amount)}
            </span>
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(t)}
                className="text-xs font-medium text-emerald-600 hover:underline"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(t)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
