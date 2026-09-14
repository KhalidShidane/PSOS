import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";

const router = Router();

router.use(protect);

router.route("/").get(getSchedules).post(createSchedule);
router.route("/:id").get(getScheduleById).put(updateSchedule).patch(updateSchedule).delete(deleteSchedule);

export default router;
