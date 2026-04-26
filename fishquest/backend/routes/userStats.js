import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserSpeciesStats from "../models/UserSpeciesStats.js";

const router = express.Router();

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

    res.json({
      totalCatches: user?.stats?.totalCatches || 0,
      species: speciesStats,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
});

export default router;
