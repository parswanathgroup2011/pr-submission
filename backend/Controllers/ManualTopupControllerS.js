const ManualTopup = require("../Models/ManualTopups");
const User = require("../Models/Users");
const walletService = require("../Service/walletService");
const NotificationService = require("../Service/notificationService");

// Create manual topup request
const createManualTopup = async (req, res) => {
  try {
    const { amount } = req.body;
    const screenshot = req.file?.filename;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!screenshot) {
      return res.status(400).json({ message: "Screenshot required" });
    }

    const request = await ManualTopup.create({
      userId: req.user._id,
      amount,
      screenshot,
      status: "pending"
    });

    return res.json({ success: true, request });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


// Admin — get all pending requests
const getPendingTopups = async (req, res) => {
  try {
    const list = await ManualTopup.find({ status: "pending" })
      .populate("userId", "clientName email mobileNumber");

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


// APPROVE TOPUP
const approveTopup = async (req, res) => {
  try {
    const { id } = req.params;

    const reqData = await ManualTopup.findById(id).populate("userId", "clientName");
    if (!reqData) {
      return res.status(404).json({ message: "Request not found" });
    }

    const userName = reqData.userId?.clientName || "User";

    reqData.status = "approved";
    await reqData.save();

    // Add money
    await walletService.creditWallet(
      reqData.userId._id,
      reqData.amount,
      "Payment Approved"
    );

    // USER Notification
    await NotificationService.createNotification(
      reqData.userId._id,
      "user",
      "Payment Approved",
      `Your payment of ₹${reqData.amount} has been approved.`
    );

    // ADMIN Notification WITH USER NAME
    await NotificationService.createNotification(
      null,
      "admin",
      "Payment Approved",
      `Payment of ₹${reqData.amount} was approved for ${userName}.`
    );

    res.json({ message: "Payment approved successfully" });

  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};




// REJECT TOPUP
const rejectTopup = async (req, res) => {
  try {
    const { id } = req.params;

    const reqData = await ManualTopup.findById(id).populate("userId", "clientName");
    if (!reqData) {
      return res.status(404).json({ message: "Request not found" });
    }

    const userName = reqData.userId?.clientName || "User";

    reqData.status = "rejected";
    await reqData.save();

    // USER Notification
    await NotificationService.createNotification(
      reqData.userId._id,
      "user",
      "Payment Rejected",
      `Your payment request of ₹${reqData.amount} was rejected.`
    );

    // ADMIN Notification WITH USER NAME
    await NotificationService.createNotification(
      null,
      "admin",
      "Payment Rejected",
      `Payment of ₹${reqData.amount} was rejected for ${userName}`
    );

    res.json({ message: "Payment rejected" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  createManualTopup,
  getPendingTopups,
  approveTopup,
  rejectTopup
};
