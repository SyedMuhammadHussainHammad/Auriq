import { API_URL } from "../../utils/api";
import { adminAuthService } from "./adminAuthService";

export const adminSettingsService = {
  getSettingsByGroup: async (group?: string) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const url = group ? `${API_URL}/admin/cms/settings?group=${group}` : `${API_URL}/admin/cms/settings`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data; // Record<string, string>
  },

  updateSettings: async (settings: Record<string, any>, group?: string) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/cms/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ settings, group }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }
};
