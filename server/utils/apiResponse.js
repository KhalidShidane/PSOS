/**
 * Sends a response using the project's standard success envelope:
 * { success: true, message, data }
 */
export const sendSuccess = (res, { statusCode = 200, message = "Request successful", data = {} } = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export default sendSuccess;
