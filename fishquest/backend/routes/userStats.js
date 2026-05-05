import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserSpeciesStats from "../models/UserSpeciesStats.js";
import UserFishingStats from "../models/UserFishingStats.js";
const router = express.Router();
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    res.json({
      xp: user.xp,
      level: user.level,
      title: user.levelTitle,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
});
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.sub);
    const speciesStats = await UserSpeciesStats.find({
      userId: decoded.sub,
    });
    const fishingStats = await UserFishingStats.findOne({
      userId: decoded.sub,
    });
    res.json({
      totalCatches: fishingStats?.totalCatches || 0,
      skunkedCount: fishingStats?.skunkedCount || 0,
      timeOfDay: fishingStats?.timeOfDay || {},
      weather: fishingStats?.weather || {},
      baits: fishingStats?.baits || {},
      poles: fishingStats?.poles || {},
      hooks: fishingStats?.hooks || {},
      weights: fishingStats?.weights || {},

      bobberCount: fishingStats?.bobberCount || 0,

      species: speciesStats,
    });
  } catch (err) {
    console.error("USER STATS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
});

export default router;
