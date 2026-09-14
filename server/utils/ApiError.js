/**
 * Standard error type for expected/handled failures (validation, not found,
 * unauthorized, etc). Thrown from controllers/services and caught by the
 * centralized error middleware so responses stay consistent.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
