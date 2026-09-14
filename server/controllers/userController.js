import userService from "../services/userService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getMe = async (req, res, next) => {
  try {
    sendSuccess(res, { message: "Profile retrieved", data: req.user });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    sendSuccess(res, { message: "Profile updated", data: user });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    await userService.changePassword(req.user.id, req.body);
    sendSuccess(res, { message: "Password updated", data: {} });
  } catch (err) {
    next(err);
  }
};
