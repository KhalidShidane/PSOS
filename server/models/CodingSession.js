import mongoose from "mongoose";

const URL_PATTERN = /^https?:\/\/.+/i;

const codingSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: String,
      required: [true, "Project is required"],
      trim: true,
    },
    technology: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: [true, "startTime is required"],
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number,
      min: [0, "duration cannot be negative"],
    },
    workDone: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || URL_PATTERN.test(value),
        message: "githubUrl must be a valid URL",
      },
    },
    progress: {
      type: Number,
      min: [0, "progress cannot be negative"],
      max: [100, "progress cannot exceed 100"],
      default: 0,
    },
  },
  { timestamps: true }
);

codingSessionSchema.pre("validate", function deriveDuration() {
  if (this.startTime && this.endTime) {
    if (this.endTime <= this.startTime) {
      this.invalidate("endTime", "endTime must be after startTime");
    } else {
      this.duration = Math.round((this.endTime - this.startTime) / 60000);
    }
  }
});

codingSessionSchema.index({ user: 1, startTime: 1 });

export default mongoose.model("CodingSession", codingSessionSchema);
