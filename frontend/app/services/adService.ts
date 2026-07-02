import { API_URL, fetchWithTimeout } from '../utils/api';

export const adService = {
  async getActiveAds() {
    const res = await fetchWithTimeout(`${API_URL}/ads`, {
      next: { tags: ['ads'], revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch ads');
    return res.json();
  }
};
