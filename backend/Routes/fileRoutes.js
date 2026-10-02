const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();

const ensureAuthenticated = require("../Middleware/Auth");
const User = require("../Models/Users");
const PressRelease = require("../Models/pressRelease");
const ManualTopup = require("../Models/ManualTopups");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Uploads are stored inconsistently: user/press-release documents keep the
// multer `path` ("uploads/foo.png") while manual top-ups keep only `filename`.
const storedVariants = (filename) => [filename, `uploads/${filename}`];

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

// Resolves the user who owns a file, or null when no record references it.
async function resolveOwnerId(filename) {
  const variants = storedVariants(filename);

  const owner = await User.findOne({
    $or: [
      { profileImage: { $in: variants } },
      { businessLogo: { $in: variants } },
      { gstImage: { $in: variants } },
      { panImage: { $in: variants } },
    ],
  }).select("_id");
  if (owner) return owner._id;

  const pressRelease = await PressRelease.findOne({ image: { $in: variants } }).select("userId");
  if (pressRelease) return pressRelease.userId;

  const topup = await ManualTopup.findOne({ screenshot: { $in: variants } }).select("userId");
  if (topup) return topup.userId;

  return null;
}

router.get("/:filename", ensureAuthenticated, async (req, res) => {
  try {
    // basename() strips any traversal attempt such as ../../.env
    const filename = path.basename(req.params.filename);
    const extension = path.extname(filename).toLowerCase();

    if (!CONTENT_TYPES[extension]) {
      return res.status(404).json({ message: "File not found" });
    }

    const ownerId = await resolveOwnerId(filename);
    if (!ownerId) {
      return res.status(404).json({ message: "File not found" });
    }

    const isOwnerOrAdmin =
      req.user?.role === "admin" || String(ownerId) === String(req.user._id);
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const absolutePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", CONTENT_TYPES[extension]);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.sendFile(absolutePath);
  } catch (error) {
    console.error("File serve error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
