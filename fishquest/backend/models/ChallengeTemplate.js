import mongoose from "mongoose";

const challengeTemplateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "timed",
        "species_count",
        "species_size",
        "luck",
        "rig",
        "adventure",
      ],
      required: true,
    },

    scheduleType: {
      type: String,
      enum: ["daily"],
      default: "daily",
      required: true,
    },

    timeLimit: { type: Number, default: null },
    fishKey: { type: String, default: null },
    goal: { type: Number, required: true },
    rewardXp: { type: Number, required: true },

    difficulty: {
      type: String,
      enum: ["very easy", "easy", "medium", "hard", "very hard"],
      default: "easy",
    },

    verificationMode: {
      type: String,
      enum: ["auto", "manual"],
      default: "auto",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ChallengeTemplate", challengeTemplateSchema);
