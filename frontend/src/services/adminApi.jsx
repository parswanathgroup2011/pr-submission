// adminApi.js
import apiClient from './apiClient';

// Get all users
export const getAllUsers = async () => {
  const response = await apiClient.get('auth/admin/users');
  return response.data; // { users: [...] }
};

// Get all transactions
export const getAllTransactions = async () => {
  const response = await apiClient.get('auth/admin/transactions');
  return response.data; // { transactions: [...] }
};
