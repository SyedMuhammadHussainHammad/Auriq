import { adminFetch } from '../lib/adminFetch';

export const adminProductService = {
  getAll: async () => {
    return adminFetch('/products', { method: 'GET' });
  },
  create: async (formData: FormData) => {
    return adminFetch('/products', {
      method: 'POST',
      body: formData,
    });
  }
};
