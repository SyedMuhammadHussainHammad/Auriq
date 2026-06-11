const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const adService = {
  async getActiveAds() {
    const res = await fetch(`${API_URL}/ads`, {
      next: { tags: ['ads'], revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch ads');
    return res.json();
  }
};
