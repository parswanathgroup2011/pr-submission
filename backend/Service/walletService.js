// service/walletService.js
const Wallet = require('../Models/Wallet');
const WalletTransaction = require('../Models/WalletTransactionSchema');

async function debitWallet(userId, amount, description) {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet || wallet.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  wallet.balance -= amount;
  await wallet.save();

  await WalletTransaction.create({
    userId,
    amount,
    type: "debit",
    description
  });

  return wallet;
}

async function creditWallet(userId, amount, description) {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId, balance: 0 });
  }

  wallet.balance += amount;  
  await wallet.save();

  await WalletTransaction.create({
    userId,
    amount,
    type: "credit",
    description
  });

  return wallet;
}

async function getBalance(userId) {
  const wallet = await Wallet.findOne({ userId });
  return wallet ? wallet.balance : 0;
}

async function getTransactions(userId) {
  return WalletTransaction.find({ userId }).sort({ createdAt: -1 });
}

const getAllTransactions = async () => {
  const transactions = await WalletTransaction.find({})
    .populate('userId', 'clientName email companyName'); // ✅ correct fields
  return transactions;
};



module.exports = { debitWallet, creditWallet,getBalance,getTransactions,getAllTransactions};
