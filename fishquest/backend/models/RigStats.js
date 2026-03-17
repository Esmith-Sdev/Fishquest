import mongoose from "mongoose";

const rigStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RigPreset",
      required: true,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
    },
    skunked: {
      type: Number,
      default: 0,
    },
    fishCaught: {
      type: Number,
      default: 0,
    },
    fishCaughtNight: {
      type: Number,
      default: 0,
    },
    fishCaughtDay: {
      type: Number,
      default: 0,
    },
    fishCaughtMorning: {
      type: Number,
      default: 0,
    },
    challengesCompleted: {
      type: Number,
      default: 0,
    },
    avgWeight: {
      type: Number,
      default: 0,
    },
    avgLength: {
      type: Number,
      default: 0,
    },
    versatility: {
      type: Number,
      default: 0,
    },
    trophyRate: {
      type: Number,
      default: 0,
    },
    bigFishCaught: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
export default mongoose.model("RigStat", rigStatsSchema);
