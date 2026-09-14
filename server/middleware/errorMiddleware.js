/**
 * Centralized error handler. Every thrown/forwarded error ends up here so
 * the API always responds with the standard error envelope:
 * { success: false, message, error }
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let details = err.details || null;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";
    details = err.keyValue;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  } else if (statusCode >= 500) {
    // Log server-side for diagnosis, but never leak an unexpected
    // exception's raw message/stack to the client in production - only
    // our own intentional ApiError/validation/cast/duplicate branches
    // above produce messages that are safe to show publicly.
    console.error(err);
    message = "Something went wrong. Please try again later.";
    details = null;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: details,
  });
};

export default errorHandler;
