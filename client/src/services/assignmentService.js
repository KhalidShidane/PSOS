import api from "./api.js";

export const fetchAssignments = () => api.get("/assignments").then((res) => res.data.data);

export const createAssignment = (data) => api.post("/assignments", data).then((res) => res.data.data);

export const updateAssignment = (id, data) =>
  api.patch(`/assignments/${id}`, data).then((res) => res.data.data);

export const deleteAssignment = (id) => api.delete(`/assignments/${id}`).then((res) => res.data.data);
