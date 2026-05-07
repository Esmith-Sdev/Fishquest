import express from "express";
import jwt from "jsonwebtoken";
import UserChallenge from "../models/UserChallenge.js";
import ChallengeTemplate from "../models/ChallengeTemplate.js";

const router = express.Router();

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

function pickRandomItems(items, count) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub;
    const dateKey = getTodayKey();
    const difficulties = ["easy", "medium", "hard"];

    let todayChallenges = await UserChallenge.find({
      userId,
      dateKey,
    }).populate("templateId");

    if (todayChallenges.length === 0) {
      const templates = await ChallengeTemplate.find({
        scheduleType: "daily",
      });
      const selectedTemplates = difficulties
        .map((difficulty) => {
          const matchingTemplates = templates.filter(
            (template) => template.difficulty === difficulty,
          );

          return pickRandomItems(matchingTemplates, 1)[0];
        })
        .filter(Boolean);
      await UserChallenge.insertMany(
        selectedTemplates.map((template) => ({
          userId,
          templateId: template._id,
          templateKey: template.id,
          dateKey,
          progress: 0,
          isFinished: false,
          assignedAt: new Date(),
          expiresAt: getTomorrowDate(),
        })),
      );

      todayChallenges = await UserChallenge.find({
        userId,
        dateKey,
      }).populate("templateId");
    }

    const response = todayChallenges.map((challenge) => {
      const template = challenge.templateId;

      return {
        userChallengeId: challenge._id,
        templateId: template?._id,
        templateKey: challenge.templateKey,

        id: template?.id || challenge.templateKey,
        title: template?.title || "Challenge",
        type: template?.type,
        timeLimit: template?.timeLimit,
        fishKey: template?.fishKey,
        goal: template?.goal || 1,
        rewardXp: template?.rewardXp || 0,
        difficulty: template?.difficulty,

        progress: challenge.progress || 0,
        isFinished: challenge.isFinished,

        isOnCooldown:
          challenge.cooldownEndsAt &&
          new Date(challenge.cooldownEndsAt) > new Date(),

        cooldownEndsAt: challenge.cooldownEndsAt,

        assignedAt: challenge.assignedAt,
        expiresAt: challenge.expiresAt,
      };
    });
    console.log(
      "CHALLENGE API RESPONSE:",
      response.map((c) => ({
        id: c.id,
        title: c.title,
        difficulty: c.difficulty,
      })),
    );
    res.json(response);
  } catch (err) {
    console.error("Fetch daily challenges failed:", err);
    res.status(500).json({ message: "Failed to fetch daily challenges" });
  }
});

router.post("/:userChallengeId/start", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const challenge = await UserChallenge.findOne({
      _id: req.params.userChallengeId,
      userId: decoded.sub,
    });

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    challenge.startedAt = new Date(); // track start time
    await challenge.save();

    res.json({ message: "Challenge started", startedAt: challenge.startedAt });
  } catch (err) {
    console.error("Start challenge failed:", err);
    res.status(500).json({ message: "Failed to start challenge" });
  }
});
router.post("/:userChallengeId/forfeit", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const challenge = await UserChallenge.findOne({
      _id: req.params.userChallengeId,
      userId: decoded.sub,
    });

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const cooldownEnd = new Date(Date.now() + 30 * 60 * 1000);

    challenge.isOnCooldown = true;
    challenge.cooldownEndsAt = cooldownEnd;

    await challenge.save();

    res.json({
      message: "Challenge forfeited",
      cooldownEndsAt: cooldownEnd,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to forfeit challenge" });
  }
});
export default router;
