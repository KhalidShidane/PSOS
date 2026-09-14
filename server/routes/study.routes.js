import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createStudySession,
  getStudySessions,
  getStudySessionById,
  updateStudySession,
  deleteStudySession,
} from "../controllers/studyController.js";

const router = Router();

router.use(protect);

router.route("/").get(getStudySessions).post(createStudySession);
router.route("/:id").get(getStudySessionById).put(updateStudySession).patch(updateStudySession).delete(deleteStudySession);

export default router;
