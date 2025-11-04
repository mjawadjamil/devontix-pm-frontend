'use client';
import createApiClient from '../lib/api';

export const taskService = {
  // Get tasks (Admin: all, Developer: assigned)
  getTasks: async () => {
    const api = createApiClient();
    const response = await api.get('/tasks');
    return response.data;
  },

  // Create task (Admin only)
  createTask: async (taskData) => {
    const api = createApiClient();
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task (Admin: full, Developer: status only)
  updateTask: async (taskId, taskData) => {
    const api = createApiClient();
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete task (Admin only)
  deleteTask: async (taskId) => {
    const api = createApiClient();
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  }
};