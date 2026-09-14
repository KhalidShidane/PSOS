import api from "./api.js";

export const registerRequest = (data) => api.post("/auth/register", data).then((res) => res.data.data);

export const loginRequest = (data) => api.post("/auth/login", data).then((res) => res.data.data);

export const logoutRequest = () => api.post("/auth/logout").then((res) => res.data.data);

export const fetchMe = () => api.get("/users/me").then((res) => res.data.data);

export const updateProfileRequest = (data) => api.patch("/users/me", data).then((res) => res.data.data);

export const changePasswordRequest = (data) =>
  api.patch("/users/change-password", data).then((res) => res.data.data);
