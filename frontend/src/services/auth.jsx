import apiClient from '../../apiClient';

// Login API
export const loginUser = async (loginInfo) => {
  const response = await apiClient.post('/auth/login', loginInfo);
  return response.data; // return data directly
};

// Signup
export const signupUser = async (signupInfo) => {
  const formData = new FormData();
  Object.keys(signupInfo).forEach((key) => {
    const value = signupInfo[key];
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await apiClient.post('/auth/signup', formData);
  return response.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
}

// Reset Password
export const resetPassword = async (email, otp, newPassword) => {
  const response = await apiClient.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};