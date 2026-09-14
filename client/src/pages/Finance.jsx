import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions.js";
import { useFinanceAnalytics } from "../hooks/useFinanceAnalytics.js";
import { formatCurrency } from "../utils/financeHelpers.js";
import { toDateInputValue } from "../utils/taskHelpers.js";
import Modal from "../components/common/Modal.jsx";
import StatCard from "../components/common/StatCard.jsx";
import Tabs from "../components/common/Tabs.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import SkeletonRow from "../components/common/SkeletonRow.jsx";
import SkeletonStat from "../components/common/SkeletonStat.jsx";
import TrendChart from "../components/analytics/TrendChart.jsx";
import TransactionForm from "../components/finance/TransactionForm.jsx";
import TransactionList from "../components/finance/TransactionList.jsx";
import FinanceByCategory from "../components/finance/FinanceByCategory.jsx";

const PERIOD_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const buildDefaultValues = (transaction) =>
  transaction
    ? {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description || "",
        date: toDateInputValue(transaction.date),
      }
    : { type: "expense", category: "Food", date: toDateInputValue(new Date()) };

const Finance = () => {
  const { transactions, isLoading, error, addTransaction, editTransaction, removeTransaction } =
    useTransactions();
  const [period, setPeriod] = useState("weekly");
  const { data: analytics, isLoading: analyticsLoading } = useFinanceAnalytics(period);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingTransaction(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setFormError("");
    try {
      if (editingTransaction) {
        await editTransaction(editingTransaction._id, data);
      } else {
        await addTransaction(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (transaction) => {
    if (!window.confirm(`Delete this ${transaction.type} of ${formatCurrency(transaction.amount)}?`))
      return;
    await removeTransaction(transaction._id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Finance</h1>
          <p className="text-sm text-gray-500">Track your income and spending.</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add transaction
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {analyticsLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonStat key={i} />
          ))}
        </div>
      ) : (
        analytics && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={TrendingUp} label="Income" value={formatCurrency(analytics.totalIncome)} />
            <StatCard
              icon={TrendingDown}
              tone="red"
              label="Expenses"
              value={formatCurrency(analytics.totalExpenses)}
            />
            <StatCard icon={Wallet} label="Balance" value={formatCurrency(analytics.balance)} />
          </div>
        )
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Spending - last 7 days</h2>
          {analyticsLoading ? (
            <div className="h-24 animate-pulse rounded-md bg-gray-100" />
          ) : (
            <TrendChart data={analytics?.trend} valueKey="amount" />
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">By category</h2>
          {analyticsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded-md bg-gray-100" />
              ))}
            </div>
          ) : (
            <FinanceByCategory byCategory={analytics?.byCategory} />
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">All transactions</h2>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Wallet}
            message="No transactions yet. Log your first income or expense to start tracking your balance."
            actionLabel="Add transaction"
            onAction={openAddModal}
          />
        ) : (
          <TransactionList transactions={transactions} onEdit={openEditModal} onDelete={handleDelete} />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? "Edit transaction" : "Add transaction"}
      >
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <TransactionForm
          defaultValues={buildDefaultValues(editingTransaction)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={editingTransaction ? "Save changes" : "Add transaction"}
        />
      </Modal>
    </div>
  );
};

export default Finance;
