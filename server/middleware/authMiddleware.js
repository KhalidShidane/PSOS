import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

/**
 * Reads the `Authorization: Bearer <token>` header, verifies the JWT,
 * loads the user, and attaches it to req.user. Every user-owned resource
 * route sits behind this - controllers/services already read req.user.id,
 * so this is a drop-in replacement for Step 2's temporary identifyUser
 * middleware.
 */
export const protect = async (req, res, next) => {
  try {
    const header = req.header("Authorization") || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "Not authorized. No token provided.");
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Session expired. Please log in again."
          : "Invalid authentication token.";
      throw new ApiError(401, message);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "The user for this token no longer exists.");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default protect;
