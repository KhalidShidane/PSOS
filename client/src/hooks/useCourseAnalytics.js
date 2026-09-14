import { useEffect, useState } from "react";
import { fetchCourseAnalytics } from "../services/analyticsService.js";

export const useCourseAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchCourseAnalytics()
      .then((result) => {
        if (!cancelled) {
          setCourses(result);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load course analytics");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { courses, isLoading, error };
};

export default useCourseAnalytics;
