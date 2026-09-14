import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "type is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: [0, "amount cannot be negative"],
    },
    category: {
      type: String,
      trim: true,
      default: "Other",
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "date is required"],
      default: Date.now,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: 1 });

export default mongoose.model("Transaction", transactionSchema);
