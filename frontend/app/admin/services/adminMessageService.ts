import { adminFetch } from "../lib/adminFetch";

export const adminMessageService = {
  getMessages: async () => {
    const res = await adminFetch('/messages');
    return res.data;
  },

  updateMessageStatus: async (id: number, updateData: { status?: string, is_read?: boolean }) => {
    const res = await adminFetch(`/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
    return res.data;
  },

  deleteMessage: async (id: number) => {
    const res = await adminFetch(`/messages/${id}`, {
      method: "DELETE",
    });
    return res;
  }
};
