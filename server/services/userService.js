import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

// Whitelist: role and password are intentionally excluded from normal
// profile updates. Password changes go through changePassword() below.
const ALLOWED_PROFILE_FIELDS = ["name", "email", "profileImage"];

// profileImage is stored as a data: URI (no file-upload infrastructure
// exists in this project) - capped well above what a compressed avatar
// needs, so a client can't bloat a user document or abuse storage.
const MAX_PROFILE_IMAGE_LENGTH = 700_000; // ~500KB of image data, base64-encoded

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (data.profileImage !== undefined && data.profileImage !== "") {
    if (typeof data.profileImage !== "string") {
      throw new ApiError(400, "profileImage must be a string");
    }
    if (data.profileImage.length > MAX_PROFILE_IMAGE_LENGTH) {
      throw new ApiError(400, "profileImage is too large");
    }
  }

  for (const field of ALLOWED_PROFILE_FIELDS) {
    if (data[field] !== undefined) {
      if (field !== "profileImage" && typeof data[field] !== "string") {
        throw new ApiError(400, `${field} must be a string`);
      }
      user[field] = data[field];
    }
  }

  await user.save();
  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!isNonEmptyString(currentPassword) || !isNonEmptyString(newPassword)) {
    throw new ApiError(400, "currentPassword and newPassword are required");
  }

  const user = await User.findById(userId).select("+password");
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();
};

export default { updateProfile, changePassword };
