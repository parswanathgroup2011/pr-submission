// src/services/planService.js

import apiClient from './apiClient';

const API_ENDPOINT = '/plan';

/**
 * Fetch all plans.
 * @returns {Promise<Array>} Array of plan objects.
 */
export const getAllPlans = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error in getAllPlans:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a plan by ID.
 * @param {string} planId
 * @returns {Promise<Object>} Single plan object.
 */
export const getPlanById = async (planId) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINT}/${planId}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getPlanById (ID: ${planId}):`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new plan (Admin).
 * @param {Object} planData
 * @returns {Promise<Object>} Created plan object.
 */
export const createPlanAdmin = async (planData) => {
  try {
    const response = await apiClient.post(API_ENDPOINT, planData);
    return response.data;
  } catch (error) {
    console.error('Error in createPlanAdmin:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing plan (Admin).
 * @param {string} planId
 * @param {Object} planData
 * @returns {Promise<Object>} Updated plan object.
 */
export const updatePlanAdmin = async (planId, planData) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINT}/${planId}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error in updatePlanAdmin (ID: ${planId}):`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a plan by ID (Admin).
 * @param {string} planId
 * @returns {Promise<Object>} Response from server.
 */
export const deletePlanAdmin = async (planId) => {
  try {
    const response = await apiClient.delete(`${API_ENDPOINT}/${planId}`);
    return response.data;
  } catch (error) {
    console.error(`Error in deletePlanAdmin (ID: ${planId}):`, error.response?.data || error.message);
    throw error;
  }
};

export default {getAllPlans,getPlanById,createPlanAdmin,updatePlanAdmin,deletePlanAdmin}