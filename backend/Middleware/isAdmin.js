const mongoose = require("mongoose");
const User = require("../Models/Users");

// Reads the role from MongoDB. A JWT that still says "admin" is not enough
// after that user has been demoted.
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user?._id || !mongoose.isValidObjectId(req.user._id)) {
      return res.status(401).json({ message: "Unauthorized JWT token is invalid or expired" });
    }

    const user = await User.findById(req.user._id).select("role");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized JWT token is invalid or expired" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user.role = user.role;
    next();
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isAdmin;
