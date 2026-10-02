const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UsersModel = require('../Models/Users');

const ensureAuthenticated = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 401 means "not authenticated" and is what the client uses to redirect to
  // login. 403 is reserved for authenticated users lacking permission.
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: "Unauthorized. JWT token is required" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?._id || !mongoose.isValidObjectId(decoded._id)) {
      return res.status(401).json({ message: "Unauthorized JWT token is invalid or expired" });
    }

    // The token proves identity. The role used after this point is the current
    // database role, so a demotion takes effect before the token expires.
    const user = await UsersModel.findById(decoded._id).select("role");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized JWT token is invalid or expired" });
    }

    req.user = {
      email: decoded.email,
      _id: user._id,
      role: user.role,
    };
    next();
  } catch (err) {
    if (err?.name === "JsonWebTokenError" || err?.name === "TokenExpiredError" || err?.name === "NotBeforeError") {
      return res.status(401).json({ message: "Unauthorized JWT token is invalid or expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = ensureAuthenticated;
