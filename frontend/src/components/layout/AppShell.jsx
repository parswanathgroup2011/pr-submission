import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../../assets/logo.webp";
import { handleSuccess } from "../../utils";
import { toast } from "react-toastify";
import { connectSocket, socket } from "../../socket";
import AppDrawer from "./AppDrawer";

export default function AppShell({ navItems, variant = "client" }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    handleSuccess(variant === "admin" ? "Admin logged out" : "User logged out");
    navigate("/login");
  };

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    const listener = (data) => {
      toast.info(
        variant === "admin"
          ? `Admin Alert: ${data.title}`
          : `${data.title}: ${data.message}`,
        { position: "top-right" }
      );
    };
    socket?.on("newNotification", listener);
    return () => socket?.off("newNotification", listener);
  }, [variant]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            component="img"
            src={logo}
            alt="Times of Kashi"
            sx={{ height: 36, cursor: "pointer" }}
            onClick={() => navigate(variant === "admin" ? "/admin" : "/home")}
          />
          <Box sx={{ flexGrow: 1 }} />
          {variant === "admin" ? (
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                aria-label="Notifications"
                onClick={() => navigate("/admin/notifications")}
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  aria-label="Notifications"
                  onClick={() => navigate("/notifications")}
                >
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="My Profile">
                <IconButton
                  color="inherit"
                  aria-label="My Profile"
                  onClick={() => navigate("/profile")}
                >
                  <AccountBoxIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              aria-label="Logout"
              onClick={handleLogout}
              sx={{ ml: 0.5 }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        <AppDrawer
          items={navItems}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: "background.default",
            p: { xs: 2, sm: 3 },
            minWidth: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
