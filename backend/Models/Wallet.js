// models/Wallet.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', unique: true, required: true }, // ✅ Fix: required (not require)
  balance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('wallets', WalletSchema);
  