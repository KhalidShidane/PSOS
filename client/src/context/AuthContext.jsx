import { createContext, useCallback, useEffect, useState } from "react";
import {
  registerRequest,
  loginRequest,
  logoutRequest,
  fetchMe,
} from "../services/authService.js";
import { getToken, setToken, clearToken } from "../utils/authStorage.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Starts true so ProtectedRoute doesn't redirect to /login before the
  // stored token has had a chance to be validated against the API.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await fetchMe();
        setUser(me);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // A background request can 401 (expired/invalid token) outside of any
  // explicit auth action - react-api.js dispatches this event so auth
  // state stays in sync without a circular import between the two.
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("psos:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("psos:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser, token } = await loginRequest(credentials);
    setToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (data) => {
    const { user: newUser, token } = await registerRequest(data);
    setToken(token);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Best-effort - logout proceeds client-side regardless.
    }
    clearToken();
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
