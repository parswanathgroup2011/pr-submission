import React, { useEffect, useState } from "react";
import { getAdminNotifications, markAsRead } from "../../services/notificationApi";
import NotificationList from "../../components/ui/NotificationList";

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

  return (
    <NotificationList
      title="Notifications"
      description="Payment approvals and admin alerts."
      items={notifications}
      loading={loading}
      onMarkRead={handleMarkRead}
      backTo="/admin"
    />
  );
};

export default AdminNotifications;
