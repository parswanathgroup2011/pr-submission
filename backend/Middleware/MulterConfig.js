const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  
  console.log("Uploaded file type:", file.mimetype); // Debugging log
  
  if (!file.mimetype) {
    console.log("Error: No mimetype detected");
    return cb(new Error("Invalid file type"), false);
  }
  
  if (allowedTypes.includes(file.mimetype.toLowerCase())) { // Convert mimetype to lowercase for safety
    cb(null, true);
  } else {
    console.log("Rejected file type:", file.mimetype);
    cb(new Error("Only images (jpeg, png, jpg) are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
});

module.exports = upload;
