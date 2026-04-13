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
    skunked: { type: Boolean },
    notes: { type: String, default: "" },
    imageUrls: { type: [String], default: [] },
    rigPresetId: { type: mongoose.Schema.Types.ObjectId, ref: "Rigs" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    weightUnit: { type: String, default: "LB" },
    lengthUnit: { type: String, default: "CM" },
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
