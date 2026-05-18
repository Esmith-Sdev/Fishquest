import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/preferences", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select(
      "notificationsEnabled locationEnabled expoPushTokens",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user preferences:", error.message);
    res.status(500).json({ message: "Failed to fetch user preferences." });
  }
});

router.patch("/preferences", protect, async (req, res) => {
  try {
    const { notificationsEnabled, locationEnabled, expoPushToken } = req.body;

    const update = {};
    if (notificationsEnabled !== undefined) {
      update.notificationsEnabled = Boolean(notificationsEnabled);
    }
    if (locationEnabled !== undefined) {
      update.locationEnabled = Boolean(locationEnabled);
    }

    const query = { _id: req.user._id || req.user.id };
    const options = { new: true };

    let user;
    if (typeof expoPushToken === "string" && expoPushToken.trim()) {
      user = await User.findOneAndUpdate(
        query,
        {
          ...update,
          $addToSet: { expoPushTokens: expoPushToken.trim() },
        },
        options,
      );
    } else {
      user = await User.findOneAndUpdate(query, update, options);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Failed to update user preferences:", error.message);
    res.status(500).json({ message: "Failed to update user preferences." });
  }
});

export default router;
