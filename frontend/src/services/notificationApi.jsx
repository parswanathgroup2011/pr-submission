import apiClient from "./apiClient";

export const getUserNotifications = async () => {
  const res = await apiClient.get("/user/notifications"); // ✔
  return res.data;
};

export const getAdminNotifications = async () => {
  const res = await apiClient.get("/admin/notifications"); // ✔
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await apiClient.put(`/notifications/read/${id}`); // ✔
  return res.data;
};
