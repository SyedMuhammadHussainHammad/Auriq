import { apiFetch } from '../../../utils/api';

const getHeaders = () => {
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auriqAdminToken') || '';
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const adminOrderService = {
  getAll: async () => {
    return await apiFetch('/admin/orders', {
      headers: getHeaders(),
    });
  },

  updateStatus: async (orderId: string, status: string) => {
    return await apiFetch(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
  }
};
