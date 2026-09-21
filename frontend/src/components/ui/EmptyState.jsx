import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

export default function EmptyState({ title = "Nothing to show", description, icon }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 6,
        px: 2,
        color: "text.secondary",
      }}
    >
      {icon || <InboxOutlinedIcon sx={{ fontSize: 40, mb: 1, color: "divider" }} />}
      <Typography variant="subtitle1" sx={{ color: "text.primary", fontWeight: 600 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ mt: 0.5, maxWidth: 360 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
