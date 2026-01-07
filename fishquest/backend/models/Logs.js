const mongoose = require("mongoose");
const logsSchema = new mongoose.Schema(
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
    weather: {
      type: String,
      enum: ["clear", "stormy", "windy", "cloudy"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ["baitcaster", "spinning", "button", "fly"],
    },
    weight: { type: Number },
    length: { type: Number },

    notes: { type: String, default: "" },
    imageUrls: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Catch", catchSchema);
