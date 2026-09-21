import React, { useEffect, useState } from "react";
import { getUserNotifications, markAsRead } from "../../services/notificationApi";
import NotificationList from "../../components/ui/NotificationList";

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
    loadNotifications();
  };

  return (
    <NotificationList
      title="Notifications"
      description="Updates about payments and account activity."
      items={notifications}
      loading={loading}
      onMarkRead={handleMarkRead}
      backTo="/home"
    />
  );
};

export default UserNotifications;
