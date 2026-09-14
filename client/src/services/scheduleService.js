import api from "./api.js";

export const fetchSchedules = () => api.get("/schedules").then((res) => res.data.data);

export const fetchSchedule = (id) => api.get(`/schedules/${id}`).then((res) => res.data.data);

export const createSchedule = (data) => api.post("/schedules", data).then((res) => res.data.data);

export const updateSchedule = (id, data) =>
  api.patch(`/schedules/${id}`, data).then((res) => res.data.data);

export const deleteSchedule = (id) => api.delete(`/schedules/${id}`).then((res) => res.data.data);
