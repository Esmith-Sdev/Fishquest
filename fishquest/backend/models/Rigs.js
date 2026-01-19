import mongoose from "mongoose";
const rigsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rigName: { type: String, required: true, trim: true, maxLength: 30 },
    poleId: { type: String, required: true },
    baitId: { type: String, required: true },
    hookId: { type: String, required: true },
    weightId: { type: String, required: true },
    bobber: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export default mongoose.model("RigPreset", rigsSchema);
