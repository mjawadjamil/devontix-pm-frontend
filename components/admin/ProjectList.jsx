'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../services/project.service';
import { userService } from '../../services/user.service';
import { useState } from 'react';

export default function ProjectsList() {
  const [editingProject, setEditingProject] = useState(null);
  const queryClient = useQueryClient();

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ projectId, projectData }) => 
      projectService.updateProject(projectId, projectData),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      setEditingProject(null);
    },
  });

  const projects = projectsData?.data?.projects || [];
  const developers = usersData?.data?.users?.filter(user => user.role === 'Developer') || [];

  const statusColors = {
    planning: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const handleDelete = async (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteMutation.mutateAsync(projectId);
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  const handleSaveEdit = async (projectData) => {
    try {
      await updateMutation.mutateAsync({
        projectId: editingProject._id,
        projectData
      });
    } catch (error) {
      alert('Failed to update project');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 border-b border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load projects
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          All Projects ({projects.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {projects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No projects found. Create your first project!
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="p-6 hover:bg-gray-50">
              {editingProject?._id === project._id ? (
                <EditProjectForm
                  project={project}
                  developers={developers}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingProject(null)}
                  isLoading={updateMutation.isLoading}
                />
              ) : (
                <ProjectCard
                  project={project}
                  onEdit={() => setEditingProject(project)}
                  onDelete={() => handleDelete(project._id)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ project, onEdit, onDelete }) {
  const statusColors = {
    planning: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>
        
        {project.description && (
          <p className="text-gray-600 mb-2">{project.description}</p>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
          <span>{project.assignedDevs?.length || 0} developers</span>
          <span>Created by: {project.createdBy?.name}</span>
        </div>

        {project.assignedDevs && project.assignedDevs.length > 0 && (
          <div className="mt-2">
            <span className="text-sm text-gray-500">Assigned to: </span>
            {project.assignedDevs.map((dev, index) => (
              <span key={dev._id} className="text-sm text-gray-700">
                {dev.name}{index < project.assignedDevs.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit project"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete project"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Edit Project Form Component
function EditProjectForm({ project, developers, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    status: project.status,
    assignedDevs: project.assignedDevs?.map(dev => dev._id) || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDevChange = (devId) => {
    setFormData(prev => ({
      ...prev,
      assignedDevs: prev.assignedDevs.includes(devId)
        ? prev.assignedDevs.filter(id => id !== devId)
        : [...prev.assignedDevs, devId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign Developers
        </label>
        <div className="space-y-2">
          {developers.map((dev) => (
            <label key={dev._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.assignedDevs.includes(dev._id)}
                onChange={() => handleDevChange(dev._id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{dev.name} ({dev.email})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}