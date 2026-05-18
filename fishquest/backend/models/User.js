import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    badgesEarned: {
      type: [String],
      default: [],
    },
    badgesShowcase: {
      type: [String],
      default: [],
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    levelTitle: {
      type: String,
      default: "Minnow Wrangler",
    },
    stats: {
      totalCatches: { type: Number, default: 0 },
    },
    passwordHash: { type: String, required: true, select: false },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notificationsEnabled: { type: Boolean, default: false },
    locationEnabled: { type: Boolean, default: false },
    trackedBuddies: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    expoPushTokens: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
