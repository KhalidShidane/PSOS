import { useCallback, useEffect, useState } from "react";
import * as courseApi from "../services/courseService.js";

/**
 * Fetches the current user's courses and exposes CRUD operations that
 * keep local state in sync, so pages don't each re-implement fetch +
 * optimistic-list-update logic.
 */
export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await courseApi.fetchCourses();
      setCourses(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load. Deliberately not routed through refresh() - it sets
  // state synchronously (before its first await), which is unsafe to do
  // directly inside an effect body. isLoading already starts true, and
  // any stale error is cleared on a successful fetch below.
  useEffect(() => {
    let cancelled = false;
    courseApi
      .fetchCourses()
      .then((data) => {
        if (!cancelled) {
          setCourses(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load courses");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addCourse = async (data) => {
    const created = await courseApi.createCourse(data);
    setCourses((prev) => [created, ...prev]);
    return created;
  };

  const editCourse = async (id, data) => {
    const updated = await courseApi.updateCourse(id, data);
    setCourses((prev) => prev.map((c) => (c._id === id ? updated : c)));
    return updated;
  };

  const removeCourse = async (id) => {
    await courseApi.deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  return { courses, isLoading, error, refresh, addCourse, editCourse, removeCourse };
};

export default useCourses;
