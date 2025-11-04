'use client';
import createApiClient from '../lib/api';

export const authService = {
  // Login user
  login: async (credentials) => {
    const api = createApiClient();
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const api = createApiClient();
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const api = createApiClient();
    const response = await api.get('/auth/me');
    return response.data;
  }
};