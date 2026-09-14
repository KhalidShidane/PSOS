const TOKEN_KEY = "psos_token";

// Centralizes where the JWT lives client-side so nothing else touches
// localStorage directly. api.js reads it for outgoing requests;
// AuthContext is the only thing that writes/clears it.
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage unavailable (private browsing, etc.) - auth simply
    // won't persist across a refresh in that case.
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
};
