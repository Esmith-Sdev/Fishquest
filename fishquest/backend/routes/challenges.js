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

    let todayChallenges = await UserChallenge.find({
      userId,
      dateKey,
    }).populate("templateId");

    if (todayChallenges.length === 0) {
      const templates = await ChallengeTemplate.find({
        scheduleType: "daily",
      });

      const selectedTemplates = pickRandomItems(templates, 3);

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

export default router;
