import { API_URL } from "../../utils/api";
import { adminAuthService } from "./adminAuthService";

export const adminTestimonialService = {
  getAll: async () => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/testimonials`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  create: async (payload: any) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/testimonials`, {
      method: "POST",
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

  update: async (id: number, payload: any) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/testimonials/${id}`, {
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

  delete: async (id: number) => {
    const token = adminAuthService.getToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
  }
};
