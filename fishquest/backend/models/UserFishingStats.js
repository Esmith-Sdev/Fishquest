import mongoose from "mongoose";

const userFishingStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    totalCatches: { type: Number, default: 0 },
    skunkedCount: { type: Number, default: 0 },

    timeOfDay: {
      morning: { type: Number, default: 0 },
      day: { type: Number, default: 0 },
      night: { type: Number, default: 0 },
    },

    weather: {
      sunny: { type: Number, default: 0 },
      stormy: { type: Number, default: 0 },
      windy: { type: Number, default: 0 },
      cloudy: { type: Number, default: 0 },
    },
    hooks: {
      j_hook: { type: Number, default: 0 },
      regular_hook: { type: Number, default: 0 },
      treble_hook: { type: Number, default: 0 },
      wacky_hook: { type: Number, default: 0 },
    },
    poles: {
      baitcaster: { type: Number, default: 0 },
      button: { type: Number, default: 0 },
      fly: { type: Number, default: 0 },
      spinning: { type: Number, default: 0 },
    },
    weights: {
      no_weight: { type: Number, default: 0 },
      bank_sinker: { type: Number, default: 0 },
      dropshot: { type: Number, default: 0 },
      egg: { type: Number, default: 0 },
      nail: { type: Number, default: 0 },
      splitshot: { type: Number, default: 0 },
      bullet: { type: Number, default: 0 },
    },
    baits: {
      live_worm: { type: Number, default: 0 },
      buzzbait: { type: Number, default: 0 },
      crankbait: { type: Number, default: 0 },
      craw: { type: Number, default: 0 },
      frog: { type: Number, default: 0 },
      grub: { type: Number, default: 0 },
      minnow: { type: Number, default: 0 },
      other_plastic: { type: Number, default: 0 },
      plopper: { type: Number, default: 0 },
      rooster_tail: { type: Number, default: 0 },
      plastic_worm: { type: Number, default: 0 },
      spinnerbait: { type: Number, default: 0 },
      spoon: { type: Number, default: 0 },
      tube: { type: Number, default: 0 },
      other_live_bait: { type: Number, default: 0 },
      corn: { type: Number, default: 0 },
    },

    bobberCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("UserFishingStats", userFishingStatsSchema);
