import apiClient from "./apiClient";

export const manualTopupRequest = async (formData) => {
  const response = await apiClient.post("/wallet/manual-topup", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
};
