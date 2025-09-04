import apiClient from "./apiClient";

export const getUsersWithWallets = async() => {
  try{
    const {data} = await apiClient.get("/admin/user-wallet");
    return data;
  }catch(error){
    console.error("Error fetching user wallets:", error);
    throw error;
  }
}