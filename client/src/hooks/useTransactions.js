import { useEffect, useState } from "react";
import * as financeApi from "../services/financeService.js";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    financeApi
      .fetchTransactions()
      .then((data) => {
        if (!cancelled) {
          setTransactions(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load transactions");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addTransaction = async (data) => {
    const created = await financeApi.createTransaction(data);
    setTransactions((prev) => [created, ...prev]);
    return created;
  };

  const editTransaction = async (id, data) => {
    const updated = await financeApi.updateTransaction(id, data);
    setTransactions((prev) => prev.map((t) => (t._id === id ? updated : t)));
    return updated;
  };

  const removeTransaction = async (id) => {
    await financeApi.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  return { transactions, isLoading, error, addTransaction, editTransaction, removeTransaction };
};

export default useTransactions;
