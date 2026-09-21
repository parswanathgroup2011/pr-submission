import AuthLayout from "../../components/ui/AuthLayout";
import FormField from "../../components/ui/FormField";
import { Box, Button, Link as MuiLink, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleError, handleSuccess } from "../../utils";
import { loginUser } from "../../services/auth";

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password required");
    }

    try {
      const { success, message, token, name, role, error } = await loginUser(loginInfo);
      if (success) {
        handleSuccess(message);
        localStorage.setItem("authToken", token);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("userRole", role);
        setTimeout(() => {
          navigate(role === "admin" ? "/admin" : "/home");
        }, 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || message);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Log in to manage press releases and your wallet."
    >
      <Box component="form" onSubmit={handleLogin}>
        <Stack spacing={2}>
          <FormField
            label="Email"
            name="email"
            type="email"
            autoFocus
            required
            value={loginInfo.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            required
            value={loginInfo.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <MuiLink component={Link} to="/forgot-password" underline="hover">
              Forgot password?
            </MuiLink>
          </Box>
          <Box sx={{ textAlign: "center", color: "text.secondary" }}>
            Don&apos;t have an account?{" "}
            <MuiLink component={Link} to="/signup" underline="hover">
              Sign up
            </MuiLink>
          </Box>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default Login;
