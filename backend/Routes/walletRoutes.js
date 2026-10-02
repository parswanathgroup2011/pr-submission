const express = require('express');
const router = express.Router();


const { getWalletBalance, getWalletTransactions } = require('../Controllers/walletController');
const ensureAuthenticated = require('../Middleware/Auth');
// GET wallet balance
router.get('/balance',ensureAuthenticated,getWalletBalance);

// GET wallet transactions
router.get('/transactions',ensureAuthenticated, getWalletTransactions);

// Wallet credit happens only through the admin-approved manual top-up flow
// (POST /api/wallet/manual-topup -> PUT /api/admin/manual-topups/approve/:id).

module.exports = router;


