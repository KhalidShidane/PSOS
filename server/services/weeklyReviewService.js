import WeeklyReview from "../models/WeeklyReview.js";
import { createCrudService } from "./crudService.js";

export default createCrudService(WeeklyReview, "WeeklyReview");
