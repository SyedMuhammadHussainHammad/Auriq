import { API_URL, fetchWithTimeout } from '../utils/api';

export const categoryService = {
  async getAllCategories() {
    const res = await fetchWithTimeout(`${API_URL}/categories`, {
      next: { tags: ['categories'], revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  }
};
