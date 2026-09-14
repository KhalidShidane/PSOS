import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import coursesRoutes from "./courses.routes.js";
import schedulesRoutes from "./schedules.routes.js";
import studyRoutes from "./study.routes.js";
import assignmentsRoutes from "./assignments.routes.js";
import tasksRoutes from "./tasks.routes.js";
import financeRoutes from "./finance.routes.js";
import prayerRoutes from "./prayer.routes.js";
import codingRoutes from "./coding.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import weeklyReviewRoutes from "./weeklyReview.routes.js";
import notificationsRoutes from "./notifications.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/courses", coursesRoutes);
router.use("/schedules", schedulesRoutes);
router.use("/study", studyRoutes);
router.use("/assignments", assignmentsRoutes);
router.use("/tasks", tasksRoutes);
router.use("/finance", financeRoutes);
router.use("/prayer", prayerRoutes);
router.use("/coding", codingRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/weekly-review", weeklyReviewRoutes);
router.use("/notifications", notificationsRoutes);

export default router;
