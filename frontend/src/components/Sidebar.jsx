import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PlanIcon from '@mui/icons-material/AccountBalanceWallet';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

const drawerWidth = 220;

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Home', icon: <DashboardIcon />, path: "/home" },
    { text: 'Transaction History', icon: <ReceiptIcon />, path: "/transactions" },
    { text: 'Plan', icon: <PlanIcon />, path: "/plans" },
    { text: 'Post Press Release', icon: <PostAddIcon />, path: "/press-release" },
    { text: 'My Profile', icon: <AccountBoxIcon />, path: '/profile' },
    { text: 'Log Out', icon: <LogoutIcon />, path: '/login', action: 'logout' },
    
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
          backgroundColor: 'rgb(231, 231, 231)',
          color: 'red',
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          height: '64px',
          px: 4
        }}
      >
        <IconButton
          // onClick={handleDrawerToggle}
          sx={{
            backgroundColor: 'rgb(50, 75, 218)',
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>

        {open && (
          <Typography>
            {/* Optional Title */}
          </Typography>
        )}
      </Toolbar>

      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                if (item.action === 'logout') {
                  localStorage.removeItem('authToken');      // ✅ correct key
                  localStorage.removeItem('loggedInUser');   // optional
                  localStorage.removeItem('userRole');       // optional
                  handleSuccess('User Logged out');
                  setTimeout(() => {
                    navigate('/login');                       // redirect after logout
                  }, 500);
                }
                else {
                  navigate(item.path);
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: open ? 'flex-start' : 'center',
                px: open ? 2 : 2.5,
                color: 'rgb(80, 79, 79)',
                '&:hover': {
                  backgroundColor: 'rgb(27, 81, 189)',
                  color: 'white',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'white',
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  mr: open ? 1 : 0,
                  color: 'inherit',
                  '& svg': {
                    fontSize: 18,
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>

              {open && (
                <ListItemText
                  primary={item.text}
                  sx={{ ml: 1 }}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: '13px',
                      color: 'inherit',
                      whiteSpace: 'nowrap',
                      display:'flex',
                      alignItems:'center'
                    }
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
