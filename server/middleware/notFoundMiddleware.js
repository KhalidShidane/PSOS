import { ApiError } from "../utils/ApiError.js";

/**
 * Catches requests to unknown routes and forwards a 404 ApiError
 * to the centralized error handler.
 */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFound;
