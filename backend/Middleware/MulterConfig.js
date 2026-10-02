const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const EXTENSION_BY_TYPE = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

const allowedTypes = Object.keys(EXTENSION_BY_TYPE);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // The extension is derived from the allowed-type map rather than from
    // file.originalname, so a client cannot choose the stored extension.
    const extension = EXTENSION_BY_TYPE[file.mimetype?.toLowerCase()] || ".bin";
    const unique = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
    cb(null, `${file.fieldname}-${unique}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype) {
    return cb(new Error("Invalid file type"), false);
  }

  if (allowedTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, png, gif, webp) are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter
});

// The mimetype checked by fileFilter is client-supplied, so the real bytes are
// verified once the file is on disk.
function hasImageSignature(buffer) {
  if (buffer.length < 12) return false;

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  const isGif = buffer.toString("ascii", 0, 6) === "GIF87a" || buffer.toString("ascii", 0, 6) === "GIF89a";
  const isWebp =
    buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";

  return isJpeg || isPng || isGif || isWebp;
}

function collectFiles(req) {
  if (req.file) return [req.file];
  if (!req.files) return [];
  return Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
}

function readSignature(filePath) {
  const handle = fs.openSync(filePath, "r");
  try {
    const buffer = Buffer.alloc(12);
    fs.readSync(handle, buffer, 0, 12, 0);
    return buffer;
  } finally {
    fs.closeSync(handle);
  }
}

// Mount directly after an `upload.*` middleware.
const verifyUploadedImages = (req, res, next) => {
  const files = collectFiles(req);
  if (files.length === 0) return next();

  const rejected = [];

  for (const file of files) {
    try {
      if (!hasImageSignature(readSignature(file.path))) {
        rejected.push(file);
      }
    } catch (error) {
      console.error("Upload verification error:", error);
      rejected.push(file);
    }
  }

  if (rejected.length > 0) {
    for (const file of files) {
      fs.promises.unlink(file.path).catch(() => {});
    }
    return res.status(400).json({
      message: "Uploaded file is not a valid image",
      success: false,
    });
  }

  return next();
};

module.exports = upload;
module.exports.verifyUploadedImages = verifyUploadedImages;
