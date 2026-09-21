import { Box, Paper, Typography } from "@mui/material";
import logo from "../../assets/logo.webp";

export default function AuthLayout({ title, subtitle, children, maxWidth = 440 }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        backgroundColor: "background.default",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: "100%",
          maxWidth,
          p: { xs: 3, sm: 4 },
          borderRadius: "12px",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              borderRadius: 1,
              px: 2,
              py: 1,
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Times of Kashi"
              sx={{ height: 32 }}
            />
          </Box>
          <Typography variant="h5">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {children}
      </Paper>
    </Box>
  );
}
