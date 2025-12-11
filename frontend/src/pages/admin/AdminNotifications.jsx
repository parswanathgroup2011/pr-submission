import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import {
  getAdminNotifications,
  markAsRead,
} from "../../services/notificationApi";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getAdminNotifications();
      setNotifications(data);
    } catch (err) {
      console.log("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    loadNotifications();
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Admin Notifications
      </Typography>

      <Paper sx={{ borderRadius: 3, p: 2 }}>
        <List>
          {notifications.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 3 }}>
              No notifications available
            </Typography>
          ) : (
            notifications.map((noti) => (
              <ListItem
                key={noti._id}
                sx={{
                  backgroundColor: noti.isRead ? "#fafafa" : "#fff3cd",
                  mb: 1,
                  borderRadius: 2,
                }}
                secondaryAction={
                  !noti.isRead && (
                    <IconButton onClick={() => handleMarkRead(noti._id)}>
                      <MarkEmailReadIcon color="success" />
                    </IconButton>
                  )
                }
              >
                <NotificationsActiveIcon sx={{ mr: 2 }} color="warning" />
                <ListItemText
                  primary={noti.title}
                  secondary={noti.message}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default AdminNotifications;
