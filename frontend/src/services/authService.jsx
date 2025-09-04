// authService.js
import apiClient from './apiClient';

// This base endpoint matches your route structure (/auth/users/...)
const API_ENDPOINT = '/auth/users';

/**
 * Fetches the currently logged-in user's profile data.
 * Calls: GET /api/auth/users/me
 */
export const getMyProfile = async () => {
  try {
    const response = await apiClient.get(`${API_ENDPOINT}/me`);
    return response.data;
  } catch (error) {
    console.error('Error in authService.getMyProfile:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Updates the currently logged-in user's profile data.
 * Can handle both JSON data and FormData for file uploads.
 * Calls: PUT /api/auth/users/me
 * @param {object | FormData} profileData - The data to update.
 */
export const updateUserProfile = async (profileData) => {
  try {
    // This now correctly points to your backend route.
    const response = await apiClient.put(`${API_ENDPOINT}/me`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error in authService.updateUserProfile:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Changes the currently logged-in user's password.
 * Calls: PUT /api/auth/users/change-password
 * @param {object} passwordData - Should contain { currentPassword, newPassword }.
 */
export const changeUserPassword = async (passwordData) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINT}/change-password`, passwordData);
    return response.data;
  } catch (error) {
    console.error('Error in authService.changeUserPassword:', error.response?.data || error.message);
    throw error;
  }
}; 