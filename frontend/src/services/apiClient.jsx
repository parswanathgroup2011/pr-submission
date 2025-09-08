// apiClient.js
import axios from 'axios'; 


// Use env variable, fallback to /api (for production)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // ❌ Do NOT set Content-Type globally here
});

// ✅ Request interceptor: Attach token to every request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // ✅ Set Content-Type only for non-FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('API Error - Status:', error.response.status);
      console.log('API Error - Data:', error.response.data);

      if (error.response.status === 401 || error.response.status === 403) {
        console.log('Authentication Error: Token might be invalid, expired, or missing');
        localStorage.removeItem('authToken');

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          console.warn('User should be redirected to login.');
        }
      }
    } else if (error.request) {
      console.error('API Error - No response received:', error.request);
    } else {
      console.error('API Error - Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
