import mongoose from "mongoose";

const URL_PATTERN = /^https?:\/\/.+/i;

const assignmentSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    attachment: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || URL_PATTERN.test(value),
        message: "attachment must be a valid URL",
      },
    },
  },
  { timestamps: true }
);

assignmentSchema.index({ user: 1, deadline: 1 });

export default mongoose.model("Assignment", assignmentSchema);
