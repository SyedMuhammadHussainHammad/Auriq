import { API_URL } from "../../utils/api";
import { adminAuthService } from "./adminAuthService";

export const adminProfileService = {
  getProfile: async () => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data; // { admin, sessions }
  },

  updateProfile: async (formData: FormData) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },

  updatePassword: async (payload: any) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
  },

  logoutOtherDevices: async (keepSessionId?: number) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/profile/sessions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ keep_session_id: keepSessionId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }
};
