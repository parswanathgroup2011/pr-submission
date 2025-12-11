import apiClient from "./apiClient";

export const getPendingTopups = async () => {
  const res = await apiClient.get("/admin/manual-topups");
  return res.data;
};

export const approveTopup = async (id) => {
  const res = await apiClient.put(`/admin/manual-topups/approve/${id}`);
  return res.data;
};

export const rejectTopup = async (id) => {
  const res = await apiClient.put(`/admin/manual-topups/reject/${id}`);
  return res.data;
};
