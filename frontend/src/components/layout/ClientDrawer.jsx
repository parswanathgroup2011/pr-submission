import { cloneElement, isValidElement } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSuccess } from "../../utils";
import { disconnectSocket } from "../../socket";
import SidebarBrand from "./SidebarBrand";

const DRAWER_WIDTH = 252;

function isSelected(pathname, path) {
  if (!path) return false;
  return pathname === path || (path !== "/home" && pathname.startsWith(path));
}

export default function ClientDrawer({ items, mobileOpen, onMobileClose, collapsed = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = items.filter((item) => item.action !== "logout");
  const logoutItem = items.find((item) => item.action === "logout");
  const overviewItems = navItems.filter((item) => item.section !== "account");
  const accountItems = navItems.filter((item) => item.section === "account");

  const handleClick = (item) => {
    if (item.action === "logout") {
      disconnectSocket();
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userRole");
      handleSuccess("User logged out");
      navigate("/login");
    } else {
      navigate(item.path);
    }
    if (isMobile) onMobileClose?.();
  };

  const renderItem = (item, { selected, danger } = {}) => {
    const icon = isValidElement(item.icon)
      ? cloneElement(item.icon, { sx: { fontSize: 20 } })
      : item.icon;

    return (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          selected={Boolean(selected)}
          onClick={() => handleClick(item)}
          sx={{
            minHeight: 44,
            px: 1.25,
            py: 0,
            borderRadius: "8px",
            color: danger ? "error.main" : selected ? "primary.main" : "text.primary",
            "& .MuiListItemIcon-root": {
              minWidth: 36,
              mr: 1,
              color: danger ? "error.main" : selected ? "primary.main" : "text.secondary",
            },
            "&:hover": {
              backgroundColor: danger
                ? "rgba(220, 38, 38, 0.06)"
                : selected
                  ? "rgba(27, 81, 189, 0.1)"
                  : "action.hover",
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(27, 81, 189, 0.08)",
              "&:hover": {
                backgroundColor: "rgba(27, 81, 189, 0.12)",
              },
            },
          }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: selected ? 600 : 500,
              lineHeight: 1.3,
              noWrap: true,
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const sectionLabel = (label) => (
    <Typography
      variant="overline"
      sx={{
        display: "block",
        px: 1.25,
        pt: 1,
        pb: 0.5,
        color: "text.secondary",
        letterSpacing: "0.08em",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {label}
    </Typography>
  );

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <SidebarBrand
        panelLabel="User panel"
        onClick={() => {
          navigate("/home");
          if (isMobile) onMobileClose?.();
        }}
      />
      <Box sx={{ overflowX: "hidden", overflowY: "auto", flex: 1, px: 1.25, pt: 2, pb: 1 }}>
        {sectionLabel("Overview")}
        <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          {overviewItems.map((item) =>
            renderItem(item, { selected: isSelected(location.pathname, item.path) })
          )}
        </List>
        {accountItems.length > 0 && (
          <>
            {sectionLabel("Account")}
            <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              {accountItems.map((item) =>
                renderItem(item, { selected: isSelected(location.pathname, item.path) })
              )}
            </List>
          </>
        )}
      </Box>
      {logoutItem && (
        <Box sx={{ px: 1.25, pt: 1, pb: 1.25, flexShrink: 0 }}>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>{renderItem(logoutItem, { danger: true })}</List>
        </Box>
      )}
    </Box>
  );

  const paperSx = {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
    overflowX: "hidden",
    borderRight: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    boxShadow: "none",
    top: 0,
    height: "100%",
  };

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": paperSx }}
      >
        {content}
      </Drawer>
    );
  }

  if (collapsed) {
    return <Box sx={{ width: 0, flexShrink: 0 }} />;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": paperSx,
      }}
    >
      {content}
    </Drawer>
  );
}
