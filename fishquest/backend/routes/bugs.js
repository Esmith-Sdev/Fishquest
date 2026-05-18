import express from "express";
import jwt from "jsonwebtoken";
import BugReport from "../models/BugReport.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub;

    const { title, description, screen, imageUrls, platform } = req.body;

    if (!title || !description || !platform) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    const bugReport = new BugReport({
      title,
      description,
      screen,
      userId,
      imageUrls,
      platform,
    });
    await bugReport.save();
    res.status(201).json({ message: "Bug report submitted successfully" });
  } catch (error) {
    console.error("Error submitting bug report:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
