import { API_URL } from "../../utils/api";
import { adminAuthService } from "./adminAuthService";

export const adminAnalyticsService = {
  getAnalytics: async () => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },
};
