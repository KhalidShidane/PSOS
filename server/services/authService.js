import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";

// Requiring strings explicitly (rather than just truthiness) closes off
// NoSQL query-operator injection via a crafted body like
// { "email": { "$gt": "" } } - such a value is truthy but is not a
// string, so it's rejected here before it ever reaches a Mongoose query.
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const register = async ({ name, email, password }) => {
  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(password)) {
    throw new ApiError(400, "name, email, and password are required");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // Schema validators (email format, password min length) still run here
  // and surface as a standard ValidationError -> 400 if bypassed above.
  const user = await User.create({ name, email, password });
  const token = signToken({ id: user._id });

  return { user, token };
};

const login = async ({ email, password }) => {
  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    throw new ApiError(400, "email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ id: user._id });
  user.password = undefined;

  return { user, token };
};

export default { register, login };
