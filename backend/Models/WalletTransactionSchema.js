// models/WalletTransaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletTransactionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String }
}, { timestamps: true }); 

module.exports = mongoose.model('wallettransactions', WalletTransactionSchema);
