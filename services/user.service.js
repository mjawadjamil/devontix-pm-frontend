'use client';
import createApiClient from '../lib/api';

export const userService = {
  // Get all users (Admin only)
  getUsers: async () => {
    const api = createApiClient();
    const response = await api.get('/users');
    return response.data;
  },

  // Update user role (Admin only)
  updateUserRole: async (userId, role) => {
    const api = createApiClient();
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  }
};