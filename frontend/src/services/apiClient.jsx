// apiClient.js
import axios from 'axios';
import { disconnectSocket } from '../socket'; 


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

      // 401 means the session is gone. 403 is a permission denial from a valid
      // session and must not sign the user out.
      // A demoted admin still has a valid session, but admin pages must close.
      const adminDenied =
        error.response.status === 403 &&
        error.response.data?.error === "Access denied. Admins only.";
      if (
        adminDenied &&
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin")
      ) {
        localStorage.setItem("userRole", "user");
        window.location.assign("/home");
      }

      if (error.response.status === 401) {
        disconnectSocket();
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userRole');

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.assign('/login');
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
