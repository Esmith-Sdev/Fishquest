import express from "express";
import RigPreset from "../models/Rigs.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();
//Create Rig
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { rigName, baitId, poleId, hookId, weightId, bobber } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!rigName?.trim())
      return res.status(400).json({ error: "Rig Name Required" });

    const bobberBoolean = Boolean(bobber);
    const preset = await RigPreset.create({
      userId,
      rigName: rigName.trim(),
      baitId,
      poleId,
      hookId,
      weightId,
      bobber: bobberBoolean,
    });
    res.status(201).json(preset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//Load Rigs
router.get("/", requireAuth, async (req, res) => {
  try {
    const presets = await RigPreset.find({ userId }).sort({ createdAt: -1 });
    res.json(presets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
