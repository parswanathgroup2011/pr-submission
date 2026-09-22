import { Box, Typography } from "@mui/material";
import logo from "../../assets/bulky-bm-mark.jpg";

export default function SidebarBrand({ panelLabel, onClick }) {
  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 2,
        py: 1.5,
        minHeight: 64,
        cursor: "pointer",
        flexShrink: 0,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Bulky Marketing"
        sx={{
          height: 40,
          width: "auto",
          flexShrink: 0,
          display: "block",
          objectFit: "contain",
          bgcolor: "#FFFFFF",
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          noWrap
          sx={{
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: 0,
            color: "text.primary",
          }}
        >
          Bulky PR Portal
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: 12.5,
            fontWeight: 500,
            lineHeight: 1.2,
            color: "primary.main",
            mt: "4px",
          }}
        >
          {panelLabel}
        </Typography>
      </Box>
    </Box>
  );
}
