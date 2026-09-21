import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { handleSuccess } from "../../utils";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function AppDrawer({ items, mobileOpen, onMobileClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const expanded = isMobile || hovered;
  const width = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

  const handleClick = (item) => {
    if (item.action === "logout") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userRole");
      handleSuccess("Logged out");
      navigate("/login");
    } else {
      navigate(item.path);
    }
    if (isMobile) onMobileClose?.();
  };

  const content = (
    <Box sx={{ overflow: "auto", pt: 1 }}>
      <List sx={{ px: 1 }}>
        {items.map((item) => {
          const selected =
            item.path &&
            (location.pathname === item.path ||
              (item.path !== "/admin" &&
                item.path !== "/home" &&
                location.pathname.startsWith(item.path)));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selected}
                onClick={() => handleClick(item)}
                sx={{
                  borderRadius: 2,
                  minHeight: 44,
                  justifyContent: expanded ? "flex-start" : "center",
                  px: expanded ? 1.5 : 1,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(27, 81, 189, 0.1)",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(27, 81, 189, 0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: expanded ? 1.5 : 0,
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {expanded && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 13.5,
                      fontWeight: selected ? 600 : 500,
                      noWrap: true,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: EXPANDED_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            mt: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "width 0.2s ease",
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
          top: 64,
          height: "calc(100% - 64px)",
        },
      }}
    >
      {content}
    </Drawer>
  );
}

export { EXPANDED_WIDTH, COLLAPSED_WIDTH };
