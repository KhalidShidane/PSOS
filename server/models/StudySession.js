import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
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
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "Planned",
    },
  },
  { timestamps: true }
);

// Duration (minutes) is derived from start/end rather than trusted from
// the client, and endTime is required to come after startTime.
studySessionSchema.pre("validate", function deriveDuration() {
  if (this.startTime && this.endTime) {
    if (this.endTime <= this.startTime) {
      this.invalidate("endTime", "endTime must be after startTime");
    } else {
      this.duration = Math.round((this.endTime - this.startTime) / 60000);
    }
  }
});

studySessionSchema.index({ user: 1, startTime: 1 });

export default mongoose.model("StudySession", studySessionSchema);
