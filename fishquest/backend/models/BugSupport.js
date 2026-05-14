import mongoose from "mongoose";

const bugReport = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    screen: {
      type: String,
      trim: true,
    },

    imageUrls: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["open", "reviewing", "fixed", "closed"],
      default: "open",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("BugReport", bugReport);
