import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

const router = Router();

router.use(protect);

router.route("/").get(getAssignments).post(createAssignment);
router.route("/:id").get(getAssignmentById).put(updateAssignment).patch(updateAssignment).delete(deleteAssignment);

export default router;
