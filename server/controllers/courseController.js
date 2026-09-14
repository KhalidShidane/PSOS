import { createCrudController } from "./crudControllerFactory.js";
import courseService from "../services/courseService.js";

const {
  create: createCourse,
  getAll: getCourses,
  getById: getCourseById,
  update: updateCourse,
  remove: deleteCourse,
} = createCrudController(courseService, "Course");

export { createCourse, getCourses, getCourseById, updateCourse, deleteCourse };
