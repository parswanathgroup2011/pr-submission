import React from "react";
import { Box, AppBar, Toolbar, IconButton, Tooltip } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import LogoutIcon from '@mui/icons-material/Logout';
import { handleSuccess } from "../utils";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userRole');
    handleSuccess('Admin Logged out');
    setTimeout(() => navigate('/login'), 500);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Top AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "rgb(27,81,189)" }}>
        <Toolbar>
          {/* <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip> */}
        </Toolbar>
      </AppBar>

      {/* Main Layout */}
      <Box sx={{ display: "flex", flex: 1 }}>
        <AdminSidebar />

        <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#fff" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
