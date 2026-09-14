import axios from "axios";
import { getToken, clearToken } from "../utils/authStorage.js";

/**
 * Centralized Axios instance. All feature services import this instead of
 * calling axios directly, so the base URL and auth behavior live in one
 * place instead of being repeated per request.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, clear the stale token and let AuthContext know so it can
// reset auth state and redirect to /login - done via an event instead of
// importing AuthContext here, to avoid a circular dependency.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.dispatchEvent(new Event("psos:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;
