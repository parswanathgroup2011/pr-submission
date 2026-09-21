import { Box, Paper, Typography } from "@mui/material";

export default function DashboardPanel({ title, action, children }) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
        borderRadius: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {action}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}
