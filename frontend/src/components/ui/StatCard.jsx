import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

const ICON_BACKGROUNDS = {
  "primary.main": "rgba(27, 81, 189, 0.08)",
  "warning.main": "rgba(217, 119, 6, 0.12)",
  "success.main": "rgba(21, 128, 61, 0.12)",
  "error.main": "rgba(220, 38, 38, 0.12)",
};

export default function StatCard({ title, value, loading, to, icon, context, iconColor = "primary.main" }) {
  const clickable = Boolean(to);

  return (
    <Paper
      elevation={1}
      component={clickable ? Link : "div"}
      to={to}
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: "12px",
        display: "block",
        textDecoration: "none",
        color: "inherit",
        cursor: clickable ? "pointer" : "default",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": clickable
          ? {
              borderColor: "primary.main",
              boxShadow: 2,
            }
          : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        {icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: ICON_BACKGROUNDS[iconColor] || ICON_BACKGROUNDS["primary.main"],
              color: iconColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <Box sx={{ mt: 1, minHeight: 36, display: "flex", alignItems: "center" }}>
            {loading ? (
              <CircularProgress size={22} />
            ) : (
              <Typography variant="h4" sx={{ fontSize: 28 }}>
                {value ?? 0}
              </Typography>
            )}
          </Box>
          {context && !loading && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              {context}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
