import mongoose from "mongoose";

const catchSchema = new mongoose.Schema(
  {
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
    },
    timeOfDay: {
      type: String,
      enum: ["day", "morning", "storm", "night"],
    },
    method: {
      type: String,
      enum: ["baitcaster", "spinning", "button", "fly"],
    },
    weight: Number,
    length: Number,

    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Catch", catchSchema);
