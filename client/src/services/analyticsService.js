import api from "./api.js";

export const fetchDashboard = () => api.get("/analytics/dashboard").then((res) => res.data.data);

export const fetchStudyAnalytics = (period) =>
  api.get("/analytics/study", { params: { period } }).then((res) => res.data.data);

export const fetchTaskAnalytics = (period) =>
  api.get("/analytics/tasks", { params: { period } }).then((res) => res.data.data);

export const fetchAssignmentAnalytics = (period) =>
  api.get("/analytics/assignments", { params: { period } }).then((res) => res.data.data);

export const fetchCodingAnalytics = (period) =>
  api.get("/analytics/coding", { params: { period } }).then((res) => res.data.data);

export const fetchFinanceAnalytics = (period) =>
  api.get("/analytics/finance", { params: { period } }).then((res) => res.data.data);

export const fetchCourseAnalytics = () => api.get("/analytics/courses").then((res) => res.data.data);

export const fetchWeeklyAnalytics = (weekStart) =>
  api.get("/analytics/weekly", { params: weekStart ? { weekStart } : {} }).then((res) => res.data.data);
