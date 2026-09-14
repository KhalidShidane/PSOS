import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPrayerSchedule,
  getPrayerSchedules,
  getPrayerScheduleById,
  updatePrayerSchedule,
  deletePrayerSchedule,
} from "../controllers/prayerController.js";

const router = Router();

router.use(protect);

router.route("/").get(getPrayerSchedules).post(createPrayerSchedule);
router.route("/:id").get(getPrayerScheduleById).put(updatePrayerSchedule).patch(updatePrayerSchedule).delete(deletePrayerSchedule);

export default router;
