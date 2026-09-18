import { useCallback, useEffect, useState } from "react";
import { fetchFinanceAnalytics } from "../services/analyticsService.js";

export const useFinanceAnalytics = (period) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchFinanceAnalytics(period)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load finance analytics");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period, refreshToken]);

  const refetch = useCallback(() => setRefreshToken((value) => value + 1), []);
  return { data, isLoading, error, refetch };
};

export default useFinanceAnalytics;
