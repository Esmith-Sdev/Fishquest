// models/UserSpeciesStats.js
import mongoose from "mongoose";

const userSpeciesStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  speciesId: {
    type: String,
    required: true,
  },
  speciesName: {
    type: String,
    required: true,
  },
  catchCount: {
    type: Number,
    default: 0,
  },
});

userSpeciesStatsSchema.index({ userId: 1, speciesId: 1 }, { unique: true });

export default mongoose.model("UserSpeciesStats", userSpeciesStatsSchema);
