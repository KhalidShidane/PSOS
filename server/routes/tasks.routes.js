import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = Router();

router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTaskById).put(updateTask).patch(updateTask).delete(deleteTask);

export default router;
