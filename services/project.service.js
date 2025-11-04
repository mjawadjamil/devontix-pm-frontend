'use client';
import createApiClient from '../lib/api';

export const projectService = {
  // Get all projects (Admin: all, Developer: assigned)
  getProjects: async () => {
    const api = createApiClient();
    const response = await api.get('/projects');
    return response.data;
  },

  // Create project (Admin only)
  createProject: async (projectData) => {
    const api = createApiClient();
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Update project (Admin only)
  updateProject: async (projectId, projectData) => {
    const api = createApiClient();
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  },

  // Delete project (Admin only)
  deleteProject: async (projectId) => {
    const api = createApiClient();
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  }
};