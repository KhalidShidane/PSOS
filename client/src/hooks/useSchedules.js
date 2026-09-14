import { useCallback, useEffect, useState } from "react";
import * as scheduleApi from "../services/scheduleService.js";

/**
 * Fetches the current user's schedule entries and exposes CRUD operations
 * that keep local state in sync. Shared by the Timetable and University
 * pages (and, later, the Dashboard) so there is one place that owns the
 * schedule list.
 */
export const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await scheduleApi.fetchSchedules();
      setSchedules(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load schedule");
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
    scheduleApi
      .fetchSchedules()
      .then((data) => {
        if (!cancelled) {
          setSchedules(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load schedule");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addSchedule = async (data) => {
    const created = await scheduleApi.createSchedule(data);
    setSchedules((prev) => [...prev, created]);
    return created;
  };

  const editSchedule = async (id, data) => {
    const updated = await scheduleApi.updateSchedule(id, data);
    setSchedules((prev) => prev.map((s) => (s._id === id ? updated : s)));
    return updated;
  };

  const removeSchedule = async (id) => {
    await scheduleApi.deleteSchedule(id);
    setSchedules((prev) => prev.filter((s) => s._id !== id));
  };

  return { schedules, isLoading, error, refresh, addSchedule, editSchedule, removeSchedule };
};

export default useSchedules;
