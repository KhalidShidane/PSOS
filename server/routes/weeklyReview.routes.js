import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createWeeklyReview,
  getWeeklyReviews,
  getWeeklyReviewById,
  updateWeeklyReview,
  deleteWeeklyReview,
} from "../controllers/weeklyReviewController.js";

const router = Router();

router.use(protect);

router.route("/").get(getWeeklyReviews).post(createWeeklyReview);
router.route("/:id").get(getWeeklyReviewById).put(updateWeeklyReview).patch(updateWeeklyReview).delete(deleteWeeklyReview);

export default router;
