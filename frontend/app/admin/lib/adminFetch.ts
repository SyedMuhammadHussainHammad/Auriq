const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

const processQueue = () => {
  refreshQueue.forEach(cb => cb());
  refreshQueue = [];
};

const tryRefresh = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('adminRefreshToken');
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/admin/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('adminToken', data.data.accessToken);
      return true;
    }
  } catch {}
  return false;
};

const forceLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRefreshToken');
  window.location.href = '/admin/login';
};

export const adminFetch = async (endpoint: string, options: RequestInit = {}, _isRetry = false): Promise<any> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  } else {
    headers.delete('Content-Type');
  }

  const response = await fetch(`${API_URL}/admin${endpoint}`, { ...options, headers });

  if ((response.status === 401 || response.status === 403) && !_isRetry) {
    if (typeof window !== 'undefined') {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          refreshQueue.push(() => {
            adminFetch(endpoint, options, true).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;
      const refreshed = await tryRefresh();
      isRefreshing = false;

      if (refreshed) {
        processQueue();
        return adminFetch(endpoint, options, true);
      } else {
        processQueue();
        forceLogout();
        return;
      }
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
