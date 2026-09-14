import api from "./api.js";

export const fetchStudySessions = () => api.get("/study").then((res) => res.data.data);

export const createStudySession = (data) => api.post("/study", data).then((res) => res.data.data);

export const updateStudySession = (id, data) =>
  api.patch(`/study/${id}`, data).then((res) => res.data.data);

export const deleteStudySession = (id) => api.delete(`/study/${id}`).then((res) => res.data.data);
