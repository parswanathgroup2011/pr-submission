import React, { useEffect } from "react";
import { Box, AppBar, Toolbar, IconButton, Tooltip } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from "@mui/icons-material/Notifications";

import { handleSuccess } from "../utils";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { socket, connectSocket } from "../socket";  // ✅ IMPORT connectSocket

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    handleSuccess("Admin logged out");
    navigate("/login");
  };

  // ⭐ CONNECT SOCKET WHEN ADMIN LAYOUT LOADS
  useEffect(() => {
    connectSocket();
  }, []);

  // ⭐ ADMIN — REAL-TIME NOTIFICATIONS
  useEffect(() => {
    const listener = (data) => {
      console.log("🔔 Admin received:", data);

      toast.info(`Admin Alert: ${data.title}`, {
        position: "top-right",
      });
    };

    socket.on("newNotification", listener);

    return () => socket.off("newNotification", listener);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {/* TOP BAR */}
      <AppBar position="static" sx={{ backgroundColor: "rgb(27,81,189)" }}>
        <Toolbar>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={() => navigate("/admin/notifications")}>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>

        </Toolbar>
      </AppBar>

      {/* MAIN AREA */}
      <Box sx={{ display: "flex", flex: 1 }}>
        <AdminSidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>

    </Box>
  );
};

export default AdminLayout;
