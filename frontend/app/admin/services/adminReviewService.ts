import { API_URL } from "../../utils/api";
import { adminAuthService } from "./adminAuthService";

export const adminReviewService = {
  getReviews: async () => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  updateReviewStatus: async (id: number, isActive: boolean) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/reviews/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ is_active: isActive }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
};
