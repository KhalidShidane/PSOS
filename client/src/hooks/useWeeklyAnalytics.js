import { useEffect, useState } from "react";
import { fetchWeeklyAnalytics } from "../services/analyticsService.js";

/** Computed (read-only, real-data) numbers for a given week. Pass an ISO
 * date string as weekStart to look at a different week; omit for "this week". */
export const useWeeklyAnalytics = (weekStart) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchWeeklyAnalytics(weekStart)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load weekly summary");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [weekStart]);

  return { data, isLoading, error };
};

export default useWeeklyAnalytics;
