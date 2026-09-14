import mongoose from "mongoose";

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const ACTIVITY_TYPES = [
  "University",
  "Study",
  "Coding",
  "Prayer",
  "Sleep",
  "Break",
  "Meal",
  "Assignment",
  "Other",
];

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ACTIVITY_TYPES,
      default: "Other",
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: DAYS_OF_WEEK,
      required: [true, "dayOfWeek is required"],
    },
    startTime: {
      type: String,
      required: [true, "startTime is required"],
      match: [TIME_PATTERN, "startTime must be in HH:MM 24-hour format"],
    },
    endTime: {
      type: String,
      required: [true, "endTime is required"],
      match: [TIME_PATTERN, "endTime must be in HH:MM 24-hour format"],
    },
    location: {
      type: String,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    description: {
      type: String,
      trim: true,
    },
    isRecurring: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Stored as "HH:MM" zero-padded strings, so lexical comparison is safe.
scheduleSchema.path("endTime").validate(function validateEndAfterStart(value) {
  if (!this.startTime || !value) return true;
  return value > this.startTime;
}, "endTime must be after startTime");

scheduleSchema.index({ user: 1, dayOfWeek: 1 });

export default mongoose.model("Schedule", scheduleSchema);
