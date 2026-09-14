import { useEffect, useState } from "react";
import { fetchAssignmentAnalytics } from "../services/analyticsService.js";

export const useAssignmentAnalytics = (period) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchAssignmentAnalytics(period)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load assignment analytics");
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

export default useAssignmentAnalytics;
