import mongoose from "mongoose";
const userChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChallengeTemplate",
      required: true,
    },

    templateKey: {
      type: String,
      required: true,
    },

    dateKey: {
      type: String,
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
    },

    isFinished: {
      type: Boolean,
      default: false,
    },

    rewardClaimed: {
      type: Boolean,
      default: false,
    },

    availableAgainAt: {
      type: Date,
      default: null,
    },

    lastCompletedDate: {
      type: String,
      default: null,
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userChallengeSchema.index(
  { userId: 1, templateKey: 1, dateKey: 1 },
  { unique: true },
);

export default mongoose.model("UserChallenge", userChallengeSchema);
