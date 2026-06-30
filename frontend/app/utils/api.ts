export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auriqAccessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const tryRefreshToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('auriqRefreshToken');
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      localStorage.setItem('auriqAccessToken', data.data.accessToken);
      return data.data.accessToken;
    }
  } catch {
    // network error during refresh — stay logged in, don't clear session
  }
  return null;
};

const clearSession = () => {
  localStorage.removeItem('auriqAccessToken');
  localStorage.removeItem('auriqRefreshToken');
  localStorage.removeItem('auriqUser');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('loginStateChange'));
  }
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}, _isRetry = false): Promise<any> => {
  const url = `${API_URL}${endpoint}`;

  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && !_isRetry) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      return apiFetch(endpoint, options, true);
    }
    clearSession();
    throw new Error('Session expired. Please sign in again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
