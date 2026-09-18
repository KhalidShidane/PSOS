import { useState } from "react";
import { CreditCard, Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
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
import ChartCard from "../components/analytics/ChartCard.jsx";
import CategoryBars from "../components/analytics/CategoryBars.jsx";
import TransactionForm from "../components/finance/TransactionForm.jsx";
import TransactionList from "../components/finance/TransactionList.jsx";

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
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useFinanceAnalytics(period);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransactionDefaults, setNewTransactionDefaults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openAddModal = () => {
    setEditingTransaction(null);
    setNewTransactionDefaults(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openBankChargeModal = () => {
    setEditingTransaction(null);
    setNewTransactionDefaults({
      type: "expense", amount: "", category: "Bank charges", description: "", date: new Date(),
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setNewTransactionDefaults(null);
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
      refetchAnalytics();
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
    refetchAnalytics();
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={TrendingUp} label="Income" value={formatCurrency(analytics.totalIncome)} />
            <StatCard
              icon={TrendingDown}
              tone="red"
              label="Expenses"
              value={formatCurrency(analytics.totalExpenses)}
            />
            <StatCard icon={Wallet} label="Balance" value={formatCurrency(analytics.balance)} />
            <StatCard icon={CreditCard} tone="gray" label="Bank charges" value={formatCurrency(analytics.bankCharges)} hint={`${analytics.bankChargeCount} recorded`} />
          </div>
        )
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Spending overview" subtitle="Your expenses across the last 7 days">
          {analyticsLoading ? (
            <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <TrendChart data={analytics?.trend} valueKey="amount" color="violet" valueFormatter={formatCurrency} />
          )}
        </ChartCard>

        <ChartCard title="Expense categories" subtitle="Where your money is going">
          {analyticsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded-md bg-gray-100" />
              ))}
            </div>
          ) : (
            <CategoryBars items={analytics?.byCategory} valueFormatter={formatCurrency} />
          )}
        </ChartCard>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-white p-4 shadow-sm">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-amber-100 p-2.5 text-amber-700"><CreditCard className="h-5 w-5" /></span><div><h2 className="text-sm font-semibold text-slate-800">Other charges</h2><p className="text-xs text-slate-500">Record bank fees, transfer costs, and service charges.</p></div></div>
        <button type="button" onClick={openBankChargeModal} className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Add bank charge</button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Bank charges tracker" subtitle="Fees and transfer costs over the last 7 days" action={<span className="rounded-lg bg-amber-100 p-2 text-amber-700"><CreditCard className="h-4 w-4" /></span>}>
          {analyticsLoading ? <div className="h-56 animate-pulse rounded-xl bg-slate-100" /> : <TrendChart data={analytics?.bankChargeTrend} valueKey="amount" color="emerald" valueFormatter={formatCurrency} />}
        </ChartCard>
        <ChartCard title="Money tracker" subtitle="A clear view of your current financial activity">
          <div className="grid h-56 grid-cols-2 content-center gap-3"><div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs font-medium text-emerald-700">Money in</p><p className="mt-1 text-xl font-bold text-emerald-900">{formatCurrency(analytics?.totalIncome)}</p></div><div className="rounded-xl bg-rose-50 p-4"><p className="text-xs font-medium text-rose-700">Money out</p><p className="mt-1 text-xl font-bold text-rose-900">{formatCurrency(analytics?.totalExpenses)}</p></div><div className="col-span-2 rounded-xl bg-slate-900 p-4 text-white"><p className="text-xs font-medium text-slate-300">Available balance</p><p className="mt-1 text-2xl font-bold">{formatCurrency(analytics?.balance)}</p></div></div>
        </ChartCard>
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
        title={editingTransaction ? "Edit transaction" : newTransactionDefaults ? "Add bank charge" : "Add transaction"}
      >
        {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
        <TransactionForm
          defaultValues={buildDefaultValues(editingTransaction || newTransactionDefaults)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={editingTransaction ? "Save changes" : newTransactionDefaults ? "Add bank charge" : "Add transaction"}
        />
      </Modal>
    </div>
  );
};

export default Finance;
