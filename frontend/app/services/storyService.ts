import { apiFetch } from '../utils/api';

export const storyService = {
  getStory: async () => {
    return await apiFetch('/story', {
      next: { tags: ['story'], revalidate: 3600 } // Cache for an hour, but allow tag revalidation
    });
  }
};
