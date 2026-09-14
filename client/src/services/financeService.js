import api from "./api.js";

export const fetchTransactions = () => api.get("/finance").then((res) => res.data.data);

export const createTransaction = (data) => api.post("/finance", data).then((res) => res.data.data);

export const updateTransaction = (id, data) =>
  api.patch(`/finance/${id}`, data).then((res) => res.data.data);

export const deleteTransaction = (id) => api.delete(`/finance/${id}`).then((res) => res.data.data);
