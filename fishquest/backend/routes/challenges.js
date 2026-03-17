import express from "express";
import { initializeChallengesForUser } from "../services/challengeService.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const challenges = await initializeChallengesForUser(userId);

    res.json(challenges);
  } catch (error) {
    console.error("Challenge initialization error:", error);
    res.status(500).json({ error: "Failed to load challenges" });
  }
});

export default router;
