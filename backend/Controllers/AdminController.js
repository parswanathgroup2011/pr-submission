const mongoose = require("mongoose");
const User = require("../Models/Users");
const walletService = require("../Service/walletService");
const { syncSocketAccess } = require("../socket/adminRoom");

const ALLOWED_ROLES = ["user", "admin"];
const SOCKET_SYNC_MESSAGE =
  "Role saved, but this user's live admin access could not be updated. Save the role again to retry.";

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -resetOtp -resetOtpExpire -resetOtpAttempts");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all wallet transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await walletService.getAllTransactions();
    res.status(200).json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: change another user's role. Signup and profile update cannot do this.
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be user or admin" });
    }

    if (String(req.user._id) === String(id)) {
      return res.status(403).json({ success: false, message: "You cannot change your own role" });
    }

    const user = await User.findById(id).select("-password -resetOtp -resetOtpExpire -resetOtpAttempts");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    try {
      if (user.role !== role) {
        user.role = role;
        await user.save();
      }
    } catch {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    // Socket reconciliation runs after the save, and also when the stored role
    // already matches, so a retry can drop admin access that an earlier
    // cleanup missed.
    let socketSync = { ok: false };
    try {
      socketSync = await syncSocketAccess(global.io, user._id, role);
    } catch {
      socketSync = { ok: false };
    }

    if (!socketSync?.ok) {
      console.error("Role saved but live socket access could not be updated");
      return res.status(200).json({
        success: true,
        socketSync: false,
        message: SOCKET_SYNC_MESSAGE,
        user: {
          _id: user._id,
          role: user.role,
        },
      });
    }

    return res.status(200).json({
      success: true,
      socketSync: true,
      message: "Role updated",
      user: {
        _id: user._id,
        role: user.role,
      },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getAllUsers, getAllTransactions, updateUserRole };
