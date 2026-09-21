import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AuthLayout from "../../components/ui/AuthLayout";
import FormField from "../../components/ui/FormField";
import { resetPassword } from "../../services/auth";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await resetPassword(email, otp, newPassword);
      setMessage(res.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter the OTP from your email and choose a new password."
    >
      <Box component="form" onSubmit={handleReset}>
        <Stack spacing={2}>
          <FormField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            label="OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <FormField
            label="New password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" size="large">
            Reset password
          </Button>
          {message && (
            <Box sx={{ color: "success.main", fontSize: 14 }}>{message}</Box>
          )}
          {error && (
            <Box sx={{ color: "error.main", fontSize: 14 }}>{error}</Box>
          )}
          <Button
            component={Link}
            to="/login"
            variant="contained"
            startIcon={<ArrowBackIcon sx={{ fontSize: 20 }} />}
            sx={{ px: 2.25, minHeight: 42, fontSize: 15 }}
          >
            Back to login
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default ResetPassword;
