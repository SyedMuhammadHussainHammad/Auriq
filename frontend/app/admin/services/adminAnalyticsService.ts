import { adminFetch } from "../lib/adminFetch";

export const adminAnalyticsService = {
  getAnalytics: async () => {
    const data = await adminFetch('/analytics');
    return data.data;
  },
};
