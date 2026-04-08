import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import "./db.js";
import User from "./models/User.js";
import challengesRoute from "./routes/challenges.js";
import rigPresetRoutes from "./routes/rigPreset.js";
import rigStatsRoutes from "./routes/rigStats.js";
import uploadRoutes from "./routes/uploads.js";
import logsRoutes from "./routes/logs.js";
import { identifyFish } from "../fishquest-mobile/api/identifyFish.js";

const app = express();

const allowedOrigins = new Set([
  "http://localhost:8081",
  "http://localhost:19006",
  "https://fishquest-frontend.onrender.com",
  "https://fishquest.onrender.com",
]);

const corsOptions = {
  origin(origin, callback) {
    console.log("CORS origin raw:", JSON.stringify(origin));

    if (!origin) return callback(null, true);

    const normalized = String(origin).replace(/\/$/, "").trim();

    if (allowedOrigins.has(normalized)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${normalized}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// explicit preflight handling
app.options(/.*/, cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

app.use("/api/rig-presets", rigPresetRoutes);
app.use("/api/rig-stats", rigStatsRoutes);
app.use("/api/challenges", challengesRoute);
app.use("/api/uploads", uploadRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/auth", router);

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const PORT = process.env.PORT || 3000;

app.get("/api/debug-cors", (req, res) => {
  res.json({
    ok: true,
    method: req.method,
    originSeen: req.headers.origin || null,
  });
});

router.post("/signup", async (req, res) => {
  try {
    let { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields Required" });
    }

    username = String(username).toLowerCase().trim();
    email = String(email).toLowerCase().trim();

    const userExisted = await User.findOne({ username });
    if (userExisted) {
      return res.status(409).json({ message: "Username is taken" });
    }

    const emailExisted = await User.findOne({ email });
    if (emailExisted) {
      return res.status(409).json({ message: "E-mail is taken" });
    }

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
    console.log("SIGNUP ERROR:", err);
    return res.status(500).json({
      message: "Signup failed",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("JWT_SECRET (login):", JWT_SECRET);
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/api", identifyFish);
