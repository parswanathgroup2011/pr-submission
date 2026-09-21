import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Link as MuiLink,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import AuthLayout from "../../components/ui/AuthLayout";
import FormField from "../../components/ui/FormField";
import { handleError, handleSuccess } from "../../utils";
import { signupUser } from "../../services/auth";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    clientName: "",
    clientType: "",
    companyName: "",
    email: "",
    mobileNumber: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    website: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    businessLogo: null,
    gstNumber: "",
    gstImage: null,
    panNumber: "",
    panImage: null,
    ifscCode: "",
    bankName: "",
    branchName: "",
    micrCode: "",
    branchCode: "",
    authorisedName: "",
    accountNumber: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignupInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e, fieldName) => {
    setSignupInfo((prev) => ({ ...prev, [fieldName]: e.target.files[0] }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { clientName, email, password, confirmPassword } = signupInfo;
    if (!clientName || !email || !password || !confirmPassword) {
      return handleError("Name, email and password are required");
    }
    if (password !== confirmPassword) {
      return handleError("Passwords do not match");
    }
    try {
      const { success, message, error } = await signupUser(signupInfo);
      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || error);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError("Something went wrong");
      console.log(err);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Register your company to submit press releases."
      maxWidth={880}
    >
      <Box component="form" onSubmit={handleSignup}>
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
          General information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField
              select
              label="Client type"
              name="clientType"
              value={signupInfo.clientType}
              onChange={handleChange}
              required
            >
              <MenuItem value="">Select client type</MenuItem>
              <MenuItem value="B2B">B2B</MenuItem>
              <MenuItem value="B2C">B2C</MenuItem>
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Client name" name="clientName" required value={signupInfo.clientName} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Company name" name="companyName" required value={signupInfo.companyName} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Email" name="email" type="email" required value={signupInfo.email} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Mobile number" name="mobileNumber" required value={signupInfo.mobileNumber} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Address" name="address" required value={signupInfo.address} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="State" name="state" value={signupInfo.state} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="City" name="city" value={signupInfo.city} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormField label="Pincode" name="pincode" required value={signupInfo.pincode} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Website" name="website" value={signupInfo.website} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Password" name="password" type="password" required value={signupInfo.password} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Confirm password" name="confirmPassword" type="password" required value={signupInfo.confirmPassword} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField
              label="Profile image"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/png, image/jpeg, image/jpg" }}
              onChange={(e) => handleFileChange(e, "profileImage")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField
              label="Business logo"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/png, image/jpeg, image/jpg" }}
              onChange={(e) => handleFileChange(e, "businessLogo")}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1.5, fontWeight: 600 }}>
          Proof details
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="GST number" name="gstNumber" value={signupInfo.gstNumber} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField
              label="GST image"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/png, image/jpeg, image/jpg" }}
              onChange={(e) => handleFileChange(e, "gstImage")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="PAN number" name="panNumber" value={signupInfo.panNumber} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField
              label="PAN image"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/png, image/jpeg, image/jpg" }}
              onChange={(e) => handleFileChange(e, "panImage")}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1.5, fontWeight: 600 }}>
          Bank details
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="IFSC code" name="ifscCode" value={signupInfo.ifscCode} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Bank name" name="bankName" value={signupInfo.bankName} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Branch name" name="branchName" value={signupInfo.branchName} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="MICR code" name="micrCode" value={signupInfo.micrCode} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Branch code" name="branchCode" value={signupInfo.branchCode} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Authorised name" name="authorisedName" value={signupInfo.authorisedName} onChange={handleChange} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Account number" name="accountNumber" value={signupInfo.accountNumber} onChange={handleChange} />
          </Grid>
        </Grid>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" size="large">
            Sign up
          </Button>
          <Box sx={{ textAlign: "center", color: "text.secondary" }}>
            Already have an account?{" "}
            <MuiLink component={Link} to="/login" underline="hover">
              Login
            </MuiLink>
          </Box>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default Signup;
