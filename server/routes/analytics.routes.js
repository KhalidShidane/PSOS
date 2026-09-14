import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getDashboard,
  getStudyAnalytics,
  getTaskAnalytics,
  getAssignmentAnalytics,
  getCodingAnalytics,
  getFinanceAnalytics,
  getCourseAnalytics,
  getWeeklyAnalytics,
} from "../controllers/analyticsController.js";

const router = Router();

router.use(protect);

router.get("/dashboard", getDashboard);
router.get("/study", getStudyAnalytics);
router.get("/tasks", getTaskAnalytics);
router.get("/assignments", getAssignmentAnalytics);
router.get("/coding", getCodingAnalytics);
router.get("/finance", getFinanceAnalytics);
router.get("/courses", getCourseAnalytics);
router.get("/weekly", getWeeklyAnalytics);

export default router;
