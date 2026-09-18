export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Books & Supplies",
  "Rent",
  "Utilities",
  "Entertainment",
  "Health",
  "Bank charges",
  "Other",
];

export const INCOME_CATEGORIES = ["Allowance", "Salary", "Scholarship", "Gift", "Other"];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount || 0);

export const sortTransactionsRecent = (transactions) =>
  [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
