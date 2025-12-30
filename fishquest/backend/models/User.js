import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 20,
    },
    badgesEarned: {
      type: [String],
      default: [],
    },
    badgesShowcase: {
      type: [String],
      default: [],
      required: true,
    },
    stats: {
      totalCatches: { type: Number, default: 0 },

      species: {
        bass: { type: Number, default: 0 },
      },

      timeOfDay: {
        required: true,
        day: { type: Number, default: 0 },
      },

      methods: {
        required: true,
        baitcaster: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
