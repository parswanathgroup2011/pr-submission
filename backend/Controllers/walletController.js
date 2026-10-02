const walletService = require('../Service/walletService');

const getWalletBalance = async (req, res) => {
  try {
    const balance = await walletService.getBalance(req.user._id);
    res.status(200).json({ success: true, balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || "Server error fetching wallet balance" });
  }
};

const getWalletTransactions = async (req, res) => {
  try {
    const transactions = await walletService.getTransactions(req.user._id);
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || "Server error fetching wallet transactions" });
  }
};


module.exports = { getWalletBalance, getWalletTransactions };



