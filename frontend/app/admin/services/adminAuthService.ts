import { adminFetch } from '../lib/adminFetch';

export const adminAuthService = {
  login: async (email: string, password: string) => {
    // Note: login route is /api/admin/login
    const res = await adminFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (res.success && res.data.accessToken) {
      localStorage.setItem('adminToken', res.data.accessToken);
    }
    return res;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  }
};
