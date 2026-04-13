import express from "express";
import jwt from "jsonwebtoken";
import Logs from "../models/Logs.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const catchLog = await Logs.create({
      ...req.body,
      userId: decoded.sub,
    });

    res.status(201).json(catchLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create log" });
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

    const updatedLog = await Logs.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.sub },
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedLog) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json(updatedLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update log" });
  }
});
export default router;
