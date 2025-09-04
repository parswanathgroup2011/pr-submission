// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { getMyProfile, updateUserProfile, changeUserPassword } from '../../services/authService';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';

const Profile = () => {
  const [profile, setProfile] = useState({
    email: '',
    mobileNumber: '',
    clientName: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await getMyProfile();
        if (response.user) {
          setProfile(response.user);
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to load your profile. Please refresh.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const dataToUpdate = {
        clientName: profile.clientName,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
      };
      const response = await updateUserProfile(dataToUpdate);
      setMessage({ type: 'success', text: response.message });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    try {
      const response = await changeUserPassword(passwordData);
      setMessage({ type: 'success', text: response.message });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="flex justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl hover:shadow-indigo-500/40 transition-shadow duration-300">
        <CardContent className="p-6 sm:p-8">
       
          {message.text && (
            <Alert severity={message.type} className="mb-6">
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleProfileSubmit} className="space-y-4">
            <Typography variant="h6" component="h2" className="mb-2 text-gray-700">
              Edit Profile Details
            </Typography>
            <TextField
              label="Full Name"
              name="clientName"
              value={profile.clientName || ''}
              onChange={handleProfileChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={profile.email || ''}
              onChange={handleProfileChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={profile.mobileNumber || ''}
              onChange={handleProfileChange}
              fullWidth
              margin="normal"
              className="mb-10"
            />


            {/* 👇 Add file upload for Business Logo */}
            <Box className="mb-4">
              <Typography variant="body1" className="mb-1 text-gray-700 font-medium">
                Business Logo
              </Typography>
              <input
                type="file"
                name="businessLogo"
                accept="image/*"
                onChange={(e) => setProfile({ ...profile, businessLogoFile: e.target.files[0] })}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className="mt-10 w-full sm:w-auto hover:scale-105 transition-transform duration-200"
            >
              Save Profile Changes
            </Button>
          </Box>

          <Divider className="my-8" />

          <Box component="form" onSubmit={handlePasswordSubmit} className="space-y-4 mt-10">
            <Typography variant="h6" component="h2" className="mb-2  text-gray-900">
              Change Password
            </Typography>
            <TextField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              className="mt-4 w-full sm:w-auto hover:scale-105 transition-transform duration-200"
            >
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
