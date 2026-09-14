import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Schedule from "./models/Schedule.js";
import Assignment from "./models/Assignment.js";
import Task from "./models/Task.js";
import PrayerSchedule from "./models/PrayerSchedule.js";

/**
 * Development-only seed script - creates one example user with a handful
 * of example records so the frontend has something to render against.
 * Never run this against a production database.
 *
 * Usage: npm run seed --prefix server
 */
const DEV_EMAIL = "dev@example.com";

const run = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to run the seed script with NODE_ENV=production.");
    process.exit(1);
  }

  await connectDB();

  let user = await User.findOne({ email: DEV_EMAIL });
  if (!user) {
    user = await User.create({
      name: "Dev Student",
      email: DEV_EMAIL,
      password: "DevPassword123!",
    });
  }

  const course = await Course.create({
    user: user._id,
    name: "Introduction to Software Engineering",
    code: "CS201",
    lecturer: "Dr. Example",
    creditHours: 3,
    location: "Room 204",
    description: "Seed example course for local development.",
  });

  await Schedule.create({
    user: user._id,
    course: course._id,
    title: "Software Engineering Lecture",
    type: "University",
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    location: "Room 204",
  });

  await Assignment.create({
    user: user._id,
    course: course._id,
    title: "Seed Assignment: Requirements Document",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: "Medium",
  });

  await Task.create({
    user: user._id,
    title: "Seed Task: Read chapter 1",
    category: "Study",
    priority: "Low",
  });

  await PrayerSchedule.create({
    user: user._id,
    fajr: "05:15",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:20",
    isha: "19:45",
    isDefault: true,
  });

  console.log(`Seed complete for dev user "${DEV_EMAIL}" (id: ${user._id})`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
