import { API_URL } from "../../utils/api";
import { adminAuthService } from "./adminAuthService";

export const adminInventoryService = {
  getInventory: async () => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};
