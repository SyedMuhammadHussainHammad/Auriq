import { adminFetch } from '../lib/adminFetch';

export const adminAuthService = {
  login: async (email: string, password: string) => {
    // Note: login route is /api/admin/login
    const res = await adminFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (res.success && res.data.accessToken) {
      sessionStorage.setItem('adminToken', res.data.accessToken);
      if (res.data.refreshToken) {
        sessionStorage.setItem('adminRefreshToken', res.data.refreshToken);
      }
    }
    return res;
  },

  logout: () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRefreshToken');
    window.location.href = '/admin/login';
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('adminToken');
    }
    return null;
  }
};
