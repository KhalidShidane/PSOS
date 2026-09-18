import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

const email = "khalidshidane@gmail.com";
const newPassword = "DevPassword123!";

const resetPassword = async () => {
  await connectDB();

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    console.log("User not found");
    await mongoose.connection.close();
    return;
  }

  user.password = newPassword;
  await user.save();

  console.log("Password reset successfully!");
  console.log("Email:", email);
  console.log("Password:", newPassword);

  await mongoose.connection.close();
};

resetPassword().catch((error) => {
  console.error("Reset failed:", error);
  process.exit(1);
});