import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Box } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // ✅ Wallet icon
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import UploadIcon from "@mui/icons-material/Upload"; 

const drawerWidth = 220;

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: "/admin" },
    { text: 'Press Releases', icon: <DescriptionIcon />, path: '/admin/press-releases' },
    { text: 'Users', icon: <PeopleIcon />, path: "/admin/users" },
    { text: 'Transactions', icon: <ReceiptIcon />, path: "/admin/transactions" },
    { text: 'Wallets', icon: <AccountBalanceWalletIcon />, path: "/admin/wallets" },
    { text: 'Payment Approval Requests', icon: <UploadIcon />, path: "/admin/manual-topups" },  // ✅ NEW PAGE
    { text: 'Logout', icon: <LogoutIcon />, path: '/login', action: 'logout' },
];


  return (
    <Drawer
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        width: open ? drawerWidth : 46,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: 'width 0.5s ease',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 46,
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
          boxSizing: 'border-box',
          backgroundColor: 'rgba(223, 221, 221, 1)',
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.action === 'logout') {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('loggedInUser');
                    localStorage.removeItem('userRole');
                    handleSuccess('Admin Logged out');
                    setTimeout(() => navigate('/login'), 500);
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: open ? 'flex-start' : 'center',
                  px: open ? 2 : 2.5,
                  '&:hover': {
                    backgroundColor: 'rgb(27, 81, 189)',
                    color: 'white',
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: 'white',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 'auto', mr: open ? 1 : 0, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.8rem" }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
