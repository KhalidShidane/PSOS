import { useEffect, useState } from "react";
import * as weeklyReviewApi from "../services/weeklyReviewService.js";

export const useWeeklyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    weeklyReviewApi
      .fetchWeeklyReviews()
      .then((data) => {
        if (!cancelled) {
          setReviews(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load weekly reviews");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addReview = async (data) => {
    const created = await weeklyReviewApi.createWeeklyReview(data);
    setReviews((prev) => [created, ...prev]);
    return created;
  };

  const editReview = async (id, data) => {
    const updated = await weeklyReviewApi.updateWeeklyReview(id, data);
    setReviews((prev) => prev.map((r) => (r._id === id ? updated : r)));
    return updated;
  };

  return { reviews, isLoading, error, addReview, editReview };
};

export default useWeeklyReviews;
