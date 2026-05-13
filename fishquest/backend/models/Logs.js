import mongoose from "mongoose";
const logsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    speciesId: {
      type: String,
      required: function () {
        return !this.skunked;
      },
    },

    speciesName: {
      type: String,
    },
    weather: {
      type: String,
      enum: ["sunny", "stormy", "windy", "cloudy"],
    },
    timeOfDay: {
      type: String,
      enum: ["morning", "day", "night"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weight: { type: Number },
    length: { type: Number },
    skunked: { type: Boolean },
    notes: { type: String, default: "" },
    imageUrls: { type: [String], default: [] },
    rigPresetId: { type: mongoose.Schema.Types.ObjectId, ref: "Rigs" },
    baitId: { type: String, default: "" },
    hookId: { type: String, default: "" },
    weightId: { type: String, default: "" },
    poleId: { type: String, default: "" },
    bobber: { type: Boolean, default: false },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    weightUnit: { type: String, default: "LB" },
    lengthUnit: { type: String, default: "CM" },
    rigSnapshot: {
      poleId: String,
      baitId: String,
      hookId: String,
      weightId: String,
      bobber: Boolean,
    },
    challenge: {
      userChallengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserChallenge",
        default: null,
      },
      templateKey: {
        type: String,
        default: null,
      },
      title: {
        type: String,
        default: null,
      },
    },
  },

  { timestamps: true },
);
logsSchema.pre("validate", function () {
  if (!this.skunked && !this.speciesId) {
    this.invalidate(
      "speciesId",
      "speciesId is required unless skunked is true",
    );
  }
});
export default mongoose.model("Logs", logsSchema);
