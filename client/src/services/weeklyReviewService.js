import api from "./api.js";

export const fetchWeeklyReviews = () => api.get("/weekly-review").then((res) => res.data.data);

export const createWeeklyReview = (data) =>
  api.post("/weekly-review", data).then((res) => res.data.data);

export const updateWeeklyReview = (id, data) =>
  api.patch(`/weekly-review/${id}`, data).then((res) => res.data.data);
