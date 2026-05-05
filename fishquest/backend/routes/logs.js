import express from "express";
import jwt from "jsonwebtoken";
import Logs from "../models/Logs.js";
import RigStats from "../models/RigStats.js";
import getTimeOfDay from "../utils/getTimeOfDay.js";
import User from "../models/User.js";
import UserSpeciesStats from "../models/UserSpeciesStats.js";
import RigPreset from "../models/Rigs.js";
import UserFishingStats from "../models/UserFishingStats.js";
import { checkDailyChallengesForLog } from "../utils/checkDailyChallengesForLog.js";
import { recalculateUserFishingStats } from "../utils/recalculateUserFishingStats.js";
import { awardXp } from "../utils/awardXp.js";
const router = express.Router();

async function recalculateRigStats(userId, rigId) {
  if (!rigId) return;

  const rigLogs = await Logs.find({ userId, rigPresetId: rigId });

  const timesUsed = rigLogs.length;
  const skunked = rigLogs.filter((log) => log.skunked).length;
  const fishLogs = rigLogs.filter((log) => !log.skunked);

  const fishCaught = fishLogs.length;
  const challengesCompleted = 0; // replace later if you track this
  const bigFishCaught = fishLogs.filter(
    (log) => Number(log.weight) >= 5,
  ).length;

  const avgWeight =
    fishLogs.length > 0
      ? fishLogs.reduce((sum, log) => sum + (Number(log.weight) || 0), 0) /
        fishLogs.length
      : 0;

  const avgLength =
    fishLogs.length > 0
      ? fishLogs.reduce((sum, log) => sum + (Number(log.length) || 0), 0) /
        fishLogs.length
      : 0;

  let fishCaughtMorning = 0;
  let fishCaughtDay = 0;
  let fishCaughtNight = 0;

  for (const log of fishLogs) {
    if (log.timeOfDay === "morning") fishCaughtMorning++;
    else if (log.timeOfDay === "day") fishCaughtDay++;
    else if (log.timeOfDay === "night") fishCaughtNight++;
  }

  const speciesCaught = new Set(
    fishLogs.map((log) => log.speciesId).filter(Boolean),
  ).size;

  const successRate = timesUsed > 0 ? (fishCaught / timesUsed) * 100 : 0;
  const trophyRate = fishCaught > 0 ? (bigFishCaught / fishCaught) * 100 : 0;
  const versatility = Math.min((speciesCaught / 5) * 100, 100);

  await RigStats.findOneAndUpdate(
    { userId, rigId },
    {
      userId,
      rigId,
      timesUsed,
      skunked,
      fishCaught,
      challengesCompleted,
      avgWeight,
      avgLength,
      fishCaughtMorning,
      fishCaughtDay,
      fishCaughtNight,
      bigFishCaught,
      speciesCaught,
      successRate,
      trophyRate,
      versatility,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (req.body.date) {
      req.body.timeOfDay = getTimeOfDay(req.body.date);
    }

    let rigData = {};

    if (req.body.rigPresetId) {
      const rig = await RigPreset.findOne({
        _id: req.body.rigPresetId,
        userId: decoded.sub,
      });

      if (rig) {
        rigData = {
          poleId: rig.poleId,
          baitId: rig.baitId,
          hookId: rig.hookId,
          weightId: rig.weightId,
          bobber: rig.bobber,
          rigSnapshot: {
            poleId: rig.poleId,
            baitId: rig.baitId,
            hookId: rig.hookId,
            weightId: rig.weightId,
            bobber: rig.bobber,
          },
        };
      }
    }

    if (req.body.challenge?.userChallengeId) {
      const tempLog = {
        ...req.body,
        ...rigData,
        userId: decoded.sub,
      };

      const check = await checkDailyChallengesForLog(decoded.sub, tempLog, {
        validateOnly: true,
      });

      if (check?.error) {
        return res.status(400).json({
          message: check.error,
        });
      }
    }
    const newLog = await Logs.create({
      ...req.body,
      ...rigData,
      userId: decoded.sub,
    });

    const result = await checkDailyChallengesForLog(decoded.sub, newLog);

    const completedChallenges = result.completedChallenges;
    const totalXpEarned = result.totalXp + 50;

    if (completedChallenges?.length) {
      for (const challenge of completedChallenges) {
        totalXpEarned += challenge.rewardXp || 0;
      }
    }

    totalXpEarned += 50;

    if (totalXpEarned > 0) {
      await awardXp(decoded.sub, totalXpEarned);
    }
    await recalculateUserFishingStats(decoded.sub);
    if (newLog.rigPresetId) {
      await recalculateRigStats(decoded.sub, newLog.rigPresetId.toString());
    }

    res.status(201).json({
      log: newLog,
      completedChallenges,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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

    const logs = await Logs.find({ userId: decoded.sub }).sort({
      createdAt: -1,
    });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const log = await Logs.findOne({
      _id: req.params.id,
      userId: decoded.sub,
    });

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch log" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const existingLog = await Logs.findOne({
      _id: req.params.id,
      userId: decoded.sub,
    });

    if (!existingLog) {
      return res.status(404).json({ message: "Log not found" });
    }

    const oldRigId = existingLog.rigPresetId?.toString();
    if (req.body.date) {
      req.body.timeOfDay = getTimeOfDay(req.body.date);
    }
    let rigData = {};

    if (req.body.rigPresetId) {
      const rig = await RigPreset.findOne({
        _id: req.body.rigPresetId,
        userId: decoded.sub,
      });

      if (rig) {
        rigData = {
          poleId: rig.poleId,
          baitId: rig.baitId,
          hookId: rig.hookId,
          weightId: rig.weightId,
          bobber: rig.bobber,
        };
      }
    }
    const updatedLog = await Logs.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.sub },
      {
        ...req.body,
        ...rigData,
      },
      { new: true, runValidators: true },
    );

    const newRigId = updatedLog.rigPresetId?.toString();

    if (oldRigId) {
      await recalculateRigStats(decoded.sub, oldRigId);
    }

    if (newRigId && newRigId !== oldRigId) {
      await recalculateRigStats(decoded.sub, newRigId);
    }
    await recalculateUserFishingStats(decoded.sub);
    res.json(updatedLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update log" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const deletedLog = await Logs.findOneAndDelete({
      _id: req.params.id,
      userId: decoded.sub,
    });

    if (!deletedLog) {
      return res.status(404).json({ message: "Log not found" });
    }

    const oldRigId = deletedLog.rigPresetId?.toString();

    if (oldRigId) {
      await recalculateRigStats(decoded.sub, oldRigId);
    }

    await recalculateUserFishingStats(decoded.sub);

    res.json({ message: "Log deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete log" });
  }
});
export default router;
