const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    badgesEarned: {
      type: [String],
      default: [],
    },
    badgesShowcase: {
      type: [String],
      default: [],
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
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
