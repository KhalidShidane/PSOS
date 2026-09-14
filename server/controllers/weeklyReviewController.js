import { createCrudController } from "./crudControllerFactory.js";
import weeklyReviewService from "../services/weeklyReviewService.js";

const {
  create: createWeeklyReview,
  getAll: getWeeklyReviews,
  getById: getWeeklyReviewById,
  update: updateWeeklyReview,
  remove: deleteWeeklyReview,
} = createCrudController(weeklyReviewService, "WeeklyReview");

export {
  createWeeklyReview,
  getWeeklyReviews,
  getWeeklyReviewById,
  updateWeeklyReview,
  deleteWeeklyReview,
};
