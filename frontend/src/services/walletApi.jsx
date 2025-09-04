// walletApi.js
import apiClient from './apiClient';

// Get current wallet balance for logged-in user
export const getWalletBalance = async () => {
  const response = await apiClient.get('/wallet/balance');
  return response.data; // { balance: number }
};

// Get wallet transaction history
export const getWalletTransactions = async () => {
  const response = await apiClient.get('/wallet/transactions');
  return response.data; // { transactions: [...] }
};


export const rechargeWallet = async(amount) => {
  const response = await apiClient.post('/wallet/recharge',{amount});
  return response.data;
}


