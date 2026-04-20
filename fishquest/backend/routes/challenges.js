import express from "express";
import { initializeChallengesForUser } from "../services/challengeService.js";
import UserChallenge from "../models/UserChallenge.js";
const router = express.Router();
router.patch("/:id/start", async (req, res) => {
  try {
    const userChallenge = await UserChallenge.findById(req.params.id);

    if (!userChallenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    userChallenge.availableAgainAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await userChallenge.save();

    res.json(userChallenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to start challenge" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const challenges = await initializeChallengesForUser(userId);

    const now = new Date();

    const formatted = challenges.map((c) => {
      const isOnCooldown =
        c.availableAgainAt && new Date(c.availableAgainAt) > now;

      return {
        ...c,
        isOnCooldown,
        cooldownEndsAt: c.availableAgainAt || null,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Challenge initialization error:", error);
    res.status(500).json({ error: "Failed to load challenges" });
  }
});

export default router;
