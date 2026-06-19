import { apiFetch } from '../utils/api';

export const wishlistService = {
  getWishlist: async () => {
    return apiFetch('/wishlist');
  },
  addToWishlist: async (productId: number) => {
    return apiFetch('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },
  removeFromWishlist: async (productId: number) => {
    return apiFetch(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
  }
};
