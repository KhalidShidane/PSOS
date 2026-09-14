import jwt from "jsonwebtoken";

const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Signs a JWT containing only the user id - no email, role, or other
 * personal data goes into the token payload.
 */
export const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined. Add it to your .env file.");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default { signToken, verifyToken };
