const User = require("../Models/Users");
const walletService = require("../Service/walletService");

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
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

module.exports = { getAllUsers, getAllTransactions };
