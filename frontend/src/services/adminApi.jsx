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

// Change another user's role. Body is { role: "user" | "admin" }.
export const updateUserRole = async (userId, role) => {
  const response = await apiClient.put(`auth/admin/users/${userId}/role`, { role });
  return response.data;
};
