import { apiFetch, API_URL } from "../utils/api";

export const reviewService = {
  async getProductReviews(productId: number) {
    const res = await fetch(`${API_URL}/reviews/product/${productId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch reviews");
    return data.data;
  },

  async addReview(productId: number, rating: number, comment: string) {
    return apiFetch("/reviews", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, rating, comment }),
    });
  },
};
