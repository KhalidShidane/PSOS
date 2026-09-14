import { useEffect, useReducer } from "react";

/**
 * Returns the current time, refreshed every `intervalMs` (default 30s) so
 * live displays (next-prayer countdown, current/next activity) stay
 * accurate without a manual refresh. The interval only forces a re-render
 * (via a reducer, not raw state) - it never calls setState synchronously
 * inside the effect body itself, only from the interval's own callback.
 */
export const useNow = (intervalMs = 30000) => {
  const [, forceUpdate] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    const id = setInterval(forceUpdate, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return new Date();
};

export default useNow;
