import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/images", upload.array("images", 5), async (req, res) => {
  try {
    const uploads = await Promise.all(
      req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "fishquest/logs",
        }),
      ),
    );

    res.json({
      urls: uploads.map((u) => u.secure_url),
    });
  } catch (error) {
    console.error("Upload failed:", error.message);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
