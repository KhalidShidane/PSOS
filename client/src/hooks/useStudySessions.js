import { useEffect, useState } from "react";
import * as studyApi from "../services/studyService.js";

export const useStudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    studyApi
      .fetchStudySessions()
      .then((data) => {
        if (!cancelled) {
          setSessions(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load study sessions");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addSession = async (data) => {
    const created = await studyApi.createStudySession(data);
    setSessions((prev) => [created, ...prev]);
    return created;
  };

  const editSession = async (id, data) => {
    const updated = await studyApi.updateStudySession(id, data);
    setSessions((prev) => prev.map((s) => (s._id === id ? updated : s)));
    return updated;
  };

  const removeSession = async (id) => {
    await studyApi.deleteStudySession(id);
    setSessions((prev) => prev.filter((s) => s._id !== id));
  };

  return { sessions, isLoading, error, addSession, editSession, removeSession };
};

export default useStudySessions;
