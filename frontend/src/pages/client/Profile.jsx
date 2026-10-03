import React, { useState, useEffect } from "react";
import { getMyProfile, updateUserProfile, changeUserPassword } from "../../services/authService";
import { Alert, Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import LoadingState from "../../components/ui/LoadingState";

const Profile = () => {
  const [profile, setProfile] = useState({
    email: "",
    mobileNumber: "",
    clientName: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await getMyProfile();
        if (response.user) setProfile(response.user);
      } catch {
        setMessage({ type: "error", text: "Failed to load your profile. Please refresh." });
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
    setMessage({ type: "", text: "" });
    try {
      const response = await updateUserProfile({
        clientName: profile.clientName,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
      });
      setMessage({ type: "success", text: response.message });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    try {
      const response = await changeUserPassword(passwordData);
      setMessage({ type: "success", text: response.message });
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    }
  };

  if (loading) return <LoadingState label="Loading profile" />;

  return (
    <Box>
      <PageHeader
        title="My profile"
        description="Update your account details and password."
        showBack
        backTo="/home"
      />
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 720, borderRadius: "12px" }}>
        {message.text && (
          <Alert severity={message.type || "info"} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}
        <Box component="form" onSubmit={handleProfileSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Profile details
          </Typography>
          <Stack spacing={2}>
            <FormField label="Full name" name="clientName" value={profile.clientName || ""} onChange={handleProfileChange} />
            <FormField label="Email" name="email" type="email" value={profile.email || ""} onChange={handleProfileChange} />
            <FormField label="Mobile number" name="mobileNumber" value={profile.mobileNumber || ""} onChange={handleProfileChange} />
            <FormField
              label="Business logo"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/*" }}
              onChange={(e) => setProfile({ ...profile, businessLogoFile: e.target.files[0] })}
            />
            <Box>
              <Button type="submit" variant="contained">
                Save profile
              </Button>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box component="form" onSubmit={handlePasswordSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Change password
          </Typography>
          <Stack spacing={2}>
            <FormField
              label="Current password"
              name="currentPassword"
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            <FormField
              label="New password"
              name="newPassword"
              type="password"
              required
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <Box>
              <Button type="submit" variant="contained">
                Change password
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
