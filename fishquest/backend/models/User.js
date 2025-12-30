import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, min: 5, max: 20 },
    badgesEarned: {
      type: [String],
      default: [],
    },
    badgesShowcase: {
      type: [String],
      validate: {
        validator: (arr) => arr.length === 4,
        message: "Exactly 4 badges must be showcased",
      },
    },
    stats: {
      totalCatches: { type: Number, default: 0 },

      species: {
        bass: { type: Number, default: 0 },
      },

      timeOfDay: {
        day: { type: Number, default: 0 },
      },

      methods: {
        baitcaster: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
