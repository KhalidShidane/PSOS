import mongoose from "mongoose";

const weeklyReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStart: {
      type: Date,
      required: [true, "weekStart is required"],
    },
    weekEnd: {
      type: Date,
      required: [true, "weekEnd is required"],
    },
    studyHours: {
      type: Number,
      min: [0, "studyHours cannot be negative"],
      default: 0,
    },
    codingHours: {
      type: Number,
      min: [0, "codingHours cannot be negative"],
      default: 0,
    },
    completedTasks: {
      type: Number,
      min: [0, "completedTasks cannot be negative"],
      default: 0,
    },
    completedAssignments: {
      type: Number,
      min: [0, "completedAssignments cannot be negative"],
      default: 0,
    },
    achievements: {
      type: String,
      trim: true,
    },
    challenges: {
      type: String,
      trim: true,
    },
    improvements: {
      type: String,
      trim: true,
    },
    nextWeekPlan: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

weeklyReviewSchema.pre("validate", function validateWeekRange() {
  if (this.weekStart && this.weekEnd && this.weekEnd <= this.weekStart) {
    this.invalidate("weekEnd", "weekEnd must be after weekStart");
  }
});

weeklyReviewSchema.index({ user: 1, weekStart: 1 });

export default mongoose.model("WeeklyReview", weeklyReviewSchema);
