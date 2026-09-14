import Course from "../models/Course.js";
import { createCrudService } from "./crudService.js";

export default createCrudService(Course, "Course");
