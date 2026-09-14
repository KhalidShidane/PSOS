import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCodingSession,
  getCodingSessions,
  getCodingSessionById,
  updateCodingSession,
  deleteCodingSession,
} from "../controllers/codingController.js";

const router = Router();

router.use(protect);

router.route("/").get(getCodingSessions).post(createCodingSession);
router.route("/:id").get(getCodingSessionById).put(updateCodingSession).patch(updateCodingSession).delete(deleteCodingSession);

export default router;
