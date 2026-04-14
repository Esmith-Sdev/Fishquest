import express from "express";
import RigStat from "../models/RigStats.js";

const router = express.Router();

router.get("/:rigId", async (req, res) => {
  try {
    const stats = await RigStat.findOne({ rigId: req.params.rigId });

    if (!stats) {
      return res.json({
        fishCaught: 0,
        skunked: 0,
        challengesCompleted: 0,
        avgWeight: 0,
        avgLength: 0,
        timesUsed: 0,
        bigFishCaught: 0,
        speciesCaught: 0,
        fishCaughtMorning: 0,
        fishCaughtDay: 0,
        fishCaughtNight: 0,
      });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rig stats" });
  }
});

export default router;
