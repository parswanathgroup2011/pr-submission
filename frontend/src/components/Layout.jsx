import React from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import logo from '../assets/logo.webp';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { handleSuccess } from "../utils"; // Ensure this is imported
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };
  const handleProfile =() => {
    setTimeout(() => {
      navigate('/profile')
    },500);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Top AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "rgb(27,81,189)", marginTop: -1 }}>
        <Toolbar>
          {/* Logo on the left */}
          <img src={logo} alt="logo" style={{ height: 40, marginLeft: 30, padding: 10 }} />

          {/* Spacer pushes the logout icon to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Logout Button on the right */}
          <Tooltip title="My Profile">
          <IconButton color="inherit" sx={{width:35,height:35,borderRadius:10}} onClick={handleProfile}>
            <AccountBoxIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="inherit" sx={{width:35, height:35,borderRadius:10,ml:2}} onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main layout below AppBar */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#fff", marginLeft: -1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
