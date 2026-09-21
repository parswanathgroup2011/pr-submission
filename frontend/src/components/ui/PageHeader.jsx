import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function PageHeader({
  title,
  description,
  action,
  toolbar,
  showBack = false,
  backTo,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    const idx = typeof window !== "undefined" ? window.history.state?.idx : undefined;
    if (typeof idx === "number" && idx > 0) {
      navigate(-1);
      return;
    }
    navigate(backTo || "/");
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ color: "text.primary" }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
        {(action || showBack) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
            {action}
            {showBack && (
              <Button
                variant="contained"
                onClick={handleBack}
                startIcon={<ArrowBackIcon sx={{ fontSize: 22 }} />}
                sx={{ minHeight: 44, minWidth: 118, px: 2.75, fontSize: 15 }}
              >
                Back
              </Button>
            )}
          </Box>
        )}
      </Box>
      {toolbar && <Box sx={{ mt: 2.5 }}>{toolbar}</Box>}
    </Box>
  );
}
