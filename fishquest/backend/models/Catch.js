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
      required: true,
    },
    timeOfDay: {
      type: String,
      enum: ["day", "evening", "night"],
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
