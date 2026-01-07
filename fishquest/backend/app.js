require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
require("../backend/db");
const bodyParser = require("body-parser");
const User = require("./models/User");
const Logs = require("./models/Logs");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

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

    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      token,
      role: user.role,
      username2: user.username,
      auth: 1,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
});

/* IMAGE UPLOAD API */
router.post("/upload", upload.array("images", 5), async (req, res) => {
  try {
    const uploads = await Promise.all(
      req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "fishquest/catches",
        })
      )
    );

    res.json({ urls: uploads.map((u) => u.secure_url) });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});
