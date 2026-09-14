import authService from "../services/authService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    sendSuccess(res, { statusCode: 201, message: "Registration successful", data: { user, token } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    sendSuccess(res, { message: "Login successful", data: { user, token } });
  } catch (err) {
    next(err);
  }
};

// JWTs are stateless, so there is nothing to invalidate server-side; the
// client is responsible for discarding the token. This endpoint exists so
// logout has a consistent, protected place to extend later (e.g. a token
// blacklist) without changing the frontend contract.
export const logout = async (req, res, next) => {
  try {
    sendSuccess(res, { message: "Logout successful", data: {} });
  } catch (err) {
    next(err);
  }
};
