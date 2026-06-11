const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const categoryService = {
  async getAllCategories() {
    const res = await fetch(`${API_URL}/categories`, {
      next: { tags: ['categories'], revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  }
};
