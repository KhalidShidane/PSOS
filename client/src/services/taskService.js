import api from "./api.js";

export const fetchTasks = () => api.get("/tasks").then((res) => res.data.data);

export const createTask = (data) => api.post("/tasks", data).then((res) => res.data.data);

export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data).then((res) => res.data.data);

export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((res) => res.data.data);
