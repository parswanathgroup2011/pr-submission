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


const rechargeWallet = async (req, res) => {
  try {
    // Convert amount to number
    const amount = parseFloat(req.body.amount);

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    
    }

    // Credit wallet
    const wallet = await walletService.creditWallet(
      req.user._id,
      amount,
      "Wallet recharge"
    );

    // Return updated balance
    res.status(200).json({ success: true, balance: wallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};


module.exports = { getWalletBalance, getWalletTransactions, rechargeWallet};



