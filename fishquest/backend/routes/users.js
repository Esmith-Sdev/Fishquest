import express from "express";
import User from "../models/User.js";
import FriendRequest from "../models/Buddies.js";
import BugReport from "../models/BugReport.js";
import Logs from "../models/Logs.js";
import RigPreset from "../models/Rigs.js";
import RigStat from "../models/RigStats.js";
import UserChallenge from "../models/UserChallenge.js";
import UserFishingStats from "../models/UserFishingStats.js";
import UserSpeciesStats from "../models/UserSpeciesStats.js";
import { protect } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/preferences", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select(
      "notificationsEnabled locationEnabled expoPushTokens trackedBuddies",
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

router.patch("/tracked-buddies/:buddyId", protect, async (req, res) => {
  try {
    const { buddyId } = req.params;
    const { enabled } = req.body;

    if (!buddyId) {
      return res.status(400).json({ message: "Missing buddyId." });
    }

    const update = enabled
      ? { $addToSet: { trackedBuddies: buddyId } }
      : { $pull: { trackedBuddies: buddyId } };

    const user = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      update,
      { new: true },
    ).select("trackedBuddies");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ trackedBuddies: user.trackedBuddies });
  } catch (error) {
    console.error("Failed to update tracked buddies:", error.message);
    res.status(500).json({ message: "Failed to update tracked buddies." });
  }
});

router.get("/profile/:userId", protect, async (req, res) => {
  try {
    const buddy = await User.findById(req.params.userId).select(
      "username xp level levelTitle favoriteBait challengesCompleted",
    );

    if (!buddy) {
      return res.status(404).json({ message: "Buddy not found." });
    }

    res.json(buddy);
  } catch (error) {
    console.error("Failed to fetch buddy profile:", error.message);
    res.status(500).json({ message: "Failed to fetch buddy profile." });
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

router.delete("/me", protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Promise.all([
      Logs.deleteMany({ userId }),
      RigPreset.deleteMany({ userId }),
      RigStat.deleteMany({ userId }),
      UserChallenge.deleteMany({ userId }),
      UserFishingStats.deleteMany({ userId }),
      UserSpeciesStats.deleteMany({ userId }),
      BugReport.deleteMany({ userId }),
      FriendRequest.deleteMany({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }),
      User.updateMany(
        {},
        {
          $pull: {
            friends: userId,
            trackedBuddies: userId,
          },
        },
      ),
    ]);

    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted." });
  } catch (error) {
    console.error("Failed to delete account:", error.message);
    res.status(500).json({ message: "Failed to delete account." });
  }
});

export default router;
