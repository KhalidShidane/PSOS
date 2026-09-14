import { useEffect, useState } from "react";
import * as taskApi from "../services/taskService.js";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    taskApi
      .fetchTasks()
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load tasks");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addTask = async (data) => {
    const created = await taskApi.createTask(data);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const editTask = async (id, data) => {
    const updated = await taskApi.updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    return updated;
  };

  const removeTask = async (id) => {
    await taskApi.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return { tasks, isLoading, error, addTask, editTask, removeTask };
};

export default useTasks;
