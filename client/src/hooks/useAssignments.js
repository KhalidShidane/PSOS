import { useEffect, useState } from "react";
import * as assignmentApi from "../services/assignmentService.js";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    assignmentApi
      .fetchAssignments()
      .then((data) => {
        if (!cancelled) {
          setAssignments(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load assignments");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addAssignment = async (data) => {
    const created = await assignmentApi.createAssignment(data);
    setAssignments((prev) => [created, ...prev]);
    return created;
  };

  const editAssignment = async (id, data) => {
    const updated = await assignmentApi.updateAssignment(id, data);
    setAssignments((prev) => prev.map((a) => (a._id === id ? updated : a)));
    return updated;
  };

  const removeAssignment = async (id) => {
    await assignmentApi.deleteAssignment(id);
    setAssignments((prev) => prev.filter((a) => a._id !== id));
  };

  return { assignments, isLoading, error, addAssignment, editAssignment, removeAssignment };
};

export default useAssignments;
