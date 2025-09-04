const express = require('express');
const router = express.Router();


const { getWalletBalance, getWalletTransactions,rechargeWallet,getAllTransactions } = require('../Controllers/walletController');
const ensureAuthenticated = require('../Middleware/Auth');
// GET wallet balance
router.get('/balance',ensureAuthenticated,getWalletBalance);

// GET wallet transactions
router.get('/transactions',ensureAuthenticated, getWalletTransactions);
router.post('/recharge',ensureAuthenticated,rechargeWallet);

module.exports = router;


