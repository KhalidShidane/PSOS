import { useCallback, useEffect, useState } from "react";
import { fetchDashboard } from "../services/analyticsService.js";

const REFRESH_MS = 60000;

/** Loads the dashboard snapshot and refreshes it periodically so "current
 * activity" / the prayer countdown stay accurate without a manual reload. */
export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      fetchDashboard()
        .then((result) => {
          setData(result);
          setError("");
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to load dashboard");
        }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    load().finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [load]);

  return { data, isLoading, error, refresh: load };
};

export default useDashboard;
