import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = Router();

router.use(protect);

router.route("/").get(getCourses).post(createCourse);
router.route("/:id").get(getCourseById).put(updateCourse).patch(updateCourse).delete(deleteCourse);

export default router;
