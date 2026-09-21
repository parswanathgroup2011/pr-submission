import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AuthLayout from "../../components/ui/AuthLayout";
import FormField from "../../components/ui/FormField";
import { forgotPassword } from "../../services/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      if (response.success) {
        navigate("/reset-password", { state: { email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we will send a one-time code."
    >
      <Box component="form" onSubmit={handleSendOtp}>
        <Stack spacing={2}>
          <FormField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Button type="submit" variant="contained" size="large">
            Send OTP
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

export default ForgotPassword;
