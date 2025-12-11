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
  Badge,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import {
  getUserNotifications,
  markAsRead,
} from "../../services/notificationApi";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getUserNotifications();
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
    loadNotifications(); // refresh
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "600" }}>
        Notifications
      </Typography>

      <Paper sx={{ borderRadius: 3, p: 2 }}>
        <List>
          {notifications.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 3 }}>
              No notifications found
            </Typography>
          ) : (
            notifications.map((noti) => (
              <ListItem
                key={noti._id}
                sx={{
                  backgroundColor: noti.isRead ? "#f5f5f5" : "#e3f2fd",
                  mb: 1,
                  borderRadius: 2,
                }}
                secondaryAction={
                  !noti.isRead && (
                    <IconButton onClick={() => handleMarkRead(noti._id)}>
                      <MarkEmailReadIcon color="primary" />
                    </IconButton>
                  )
                }
              >
                <NotificationsNoneIcon sx={{ mr: 2 }} color="primary" />
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

export default UserNotifications;
