import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import "./db.js";
import User from "./models/user.js";
import challengesRoute from "./routes/challenges.js";
import rigPresetRoutes from "./routes/rigPreset.js";
import rigStatsRoutes from "./routes/rigStats.js";
import uploadRoutes from "./routes/uploads.js";
import logsRoutes from "./routes/logs.js";
const app = express();
app.use(cors());
app.use(bodyParser.json());
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
app.use(express.json());
app.use("/api/rig-presets", rigPresetRoutes);
app.use("/api/rig-stats", rigStatsRoutes);
app.use("/api/challenges", challengesRoute);
app.use("/api/uploads", uploadRoutes);
app.use("/api/logs", logsRoutes);
const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per image
});
const PORT = process.env.PORT || 3000;
app.use("/api/auth", router);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/* SIGN UP API */
router.post("/signup", async (req, res) => {
  try {
    let { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields Required" });
    }

    username = String(username).toLowerCase().trim();
    email = String(email).toLowerCase().trim();
    const userExisted = await User.findOne({ username });
    if (userExisted)
      return res.status(409).json({ message: "Username is taken" });
    const emailExisted = await User.findOne({ email });
    if (emailExisted)
      return res.status(409).json({ message: "E-mail is taken" });
    const passwordHash = await bcrypt.hash(String(password), 12);

    const user = await User.create({ username, passwordHash, email });
    const token = jwt.sign({ sub: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.status(201).json({
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: err.message });
  }
});

/* LOGIN API */
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password Required" });
    }

    const user = await User.findOne({
      username: String(username).toLowerCase().trim(),
    }).select("+passwordHash");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ sub: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      token,
      auth: 1,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
});
