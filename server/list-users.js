import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

const listUsers = async () => {
  await connectDB();

  const users = await User.find({}).select("name email role");

  console.log("\nUsers in database:\n");

  users.forEach((user) => {
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log("-------------------------");
  });

  await mongoose.connection.close();
};

listUsers().catch((error) => {
  console.error(error);
  process.exit(1);
});