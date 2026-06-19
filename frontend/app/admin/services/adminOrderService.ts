import { adminFetch } from '../lib/adminFetch';

export const adminOrderService = {
  getAll: async () => {
    return await adminFetch('/orders');
  },

  updateStatus: async (orderId: string, status: string) => {
    return await adminFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
};
