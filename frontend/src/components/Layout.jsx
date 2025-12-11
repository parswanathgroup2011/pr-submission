import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Tooltip
} from "@mui/material";

import logo from '../assets/logo.webp';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { handleSuccess } from "../utils";
import { toast } from "react-toastify";
import { connectSocket, socket } from "../socket"; // ✅ IMPORTANT

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User logged out");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  // 🔥 CONNECT SOCKET WHEN LAYOUT LOADS
  useEffect(() => {
    connectSocket();   // <--- YOU MISSED THIS
  }, []);

  // 🔥 LISTEN FOR REAL-TIME NOTIFICATIONS
  useEffect(() => {
    const listener = (data) => {
      console.log("🔔 User Notification:", data);
      toast.info(`${data.title}: ${data.message}`, { position: "top-right" });
    };

    socket?.on("newNotification", listener);

    return () => {
      socket?.off("newNotification", listener);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {/* TOP NAVBAR */}
      <AppBar position="static" sx={{ backgroundColor: "rgb(27,81,189)" }}>
        <Toolbar>

          <img src={logo} alt="logo" style={{ height: 40, marginLeft: 30 }} />

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="My Profile">
            <IconButton color="inherit" onClick={handleProfile}>
              <AccountBoxIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton color="inherit" sx={{ ml: 2 }} onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>

        </Toolbar>
      </AppBar>

      {/* MAIN CONTENT */}
      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#fff" }}>
          <Outlet />
        </Box>
      </Box>

    </Box>
  );
};

export default Layout;
