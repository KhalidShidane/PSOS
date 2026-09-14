import { useEffect, useState } from "react";
import { fetchFinanceAnalytics } from "../services/analyticsService.js";

export const useFinanceAnalytics = (period) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [period]);

  return { data, isLoading, error };
};

export default useFinanceAnalytics;
