'use client';
import createApiClient from '../lib/api';

export const dashboardService = {
  // Get admin dashboard data
  getAdminDashboard: async () => {
    const api = createApiClient();
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  // Get developer dashboard data
  getDevDashboard: async () => {
    const api = createApiClient();
    const response = await api.get('/dashboard/dev');
    return response.data;
  }
};