import mongoose from "mongoose";

const MAX_PHOTO_LENGTH = 700_000; // ~500KB of image data, base64-encoded

const courseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      maxlength: [150, "Course name cannot exceed 150 characters"],
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    lecturer: {
      type: String,
      trim: true,
    },
    creditHours: {
      type: Number,
      min: [0, "creditHours cannot be negative"],
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // A data: URI (no file-upload infrastructure in this project - same
    // pattern as User.profileImage). Capped well above what a compressed
    // thumbnail needs, so a client can't bloat a course document.
    photo: {
      type: String,
      maxlength: [MAX_PHOTO_LENGTH, "photo is too large"],
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
  },
  { timestamps: true }
);

courseSchema.index({ user: 1 });

export default mongoose.model("Course", courseSchema);
