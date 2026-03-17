import mongoose from "mongoose";

const challengeTemplateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["timed", "species_count", "luck", "rig", "adventure"],
      required: true,
    },
    scheduleType: {
      type: String,
      enum: ["static", "daily"],
      required: true,
    },
    timeLimit: { type: Number, default: null },
    fishKey: { type: String, default: null },
    goal: { type: Number, required: true },
    rewardXp: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("ChallengeTemplate", challengeTemplateSchema);
