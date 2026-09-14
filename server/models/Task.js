import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Keep completedAt consistent with status rather than trusting the client
// to set/clear it directly.
taskSchema.pre("save", function syncCompletedAt() {
  if (this.isModified("status")) {
    if (this.status === "Completed" && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== "Completed") {
      this.completedAt = null;
    }
  }
});

taskSchema.index({ user: 1, dueDate: 1 });

export default mongoose.model("Task", taskSchema);
