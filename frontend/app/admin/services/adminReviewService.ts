import { adminFetch } from "../lib/adminFetch";

export const adminReviewService = {
  getReviews: async () => {
    const res = await adminFetch('/reviews');
    return res.data;
  },

  updateReviewStatus: async (id: number, is_active: boolean) => {
    const res = await adminFetch(`/reviews/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ is_active }),
    });
    return res.data;
  }
};
