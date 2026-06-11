const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const adminFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  } else {
    // Browser sets Content-Type with boundary for FormData automatically
    headers.delete('Content-Type'); 
  }

  const response = await fetch(`${API_URL}/admin${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
