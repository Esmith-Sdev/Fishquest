import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserSpeciesStats from "../models/UserSpeciesStats.js";
import UserFishingStats from "../models/UserFishingStats.js";
import UserChallenge from "../models/UserChallenge.js";
import Log from "../models/Logs.js";
import { updateUserBadges } from "../utils/updateUserBadges.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.sub;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(userId);
    const speciesStats = await UserSpeciesStats.find({ userId });
    const fishingStats = await UserFishingStats.findOne({ userId });

    const personalBestLog = await Log.findOne({
      userId,
      weight: { $gt: 0 },
    }).sort({ weight: -1 });

    const challengesCompleted = await UserChallenge.countDocuments({
      userId,
      isFinished: true,
    });
    const badges = await updateUserBadges(userId);

    res.json({
      xp: user?.xp || 0,
      level: user?.level || 1,
      levelTitle: user?.levelTitle || "Minnow Wrangler",

      totalCatches: fishingStats?.totalCatches || 0,
      skunkedCount: fishingStats?.skunkedCount || 0,

      personalBest: personalBestLog?.weight || 0,
      challengesCompleted,

      timeOfDay: fishingStats?.timeOfDay || {},
      weather: fishingStats?.weather || {},
      baits: fishingStats?.baits || {},
      poles: fishingStats?.poles || {},
      hooks: fishingStats?.hooks || {},
      weights: fishingStats?.weights || {},

      bobberCount: fishingStats?.bobberCount || 0,
      species: speciesStats,
      badges,
    });
  } catch (err) {
    console.error("User stats failed:", err.message);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
});
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    res.json({
      xp: user.xp,
      level: user.level,
      levelTitle: user.levelTitle,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
});

export default router;
