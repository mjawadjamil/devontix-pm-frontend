'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/task.service';
import { projectService } from '../../services/project.service';
import { userService } from '../../services/user.service';
import { useState } from 'react';

export default function TasksList() {
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: ''
  });
  const queryClient = useQueryClient();

  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, taskData }) => 
      taskService.updateTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      setEditingTask(null);
    },
  });

  const tasks = tasksData?.data?.tasks || [];
  const projects = projectsData?.data?.projects || [];
  const developers = usersData?.data?.users?.filter(user => user.role === 'Developer') || [];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.project && task.project?._id !== filters.project) return false;
    return true;
  });

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };

  const priorityIcons = {
    low: '⬇️',
    medium: '🔷',
    high: '⚠️',
    urgent: '🚨',
  };

  const handleDelete = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteMutation.mutateAsync(taskId);
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const handleSaveEdit = async (taskData) => {
    try {
      await updateMutation.mutateAsync({
        taskId: editingTask._id,
        taskData
      });
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', project: '' });
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
        Failed to load tasks
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">
            All Tasks ({filteredTasks.length})
          </h3>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={filters.project}
              onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>

            {(filters.status || filters.priority || filters.project) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="divide-y divide-gray-200">
        {filteredTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {tasks.length === 0 ? 'No tasks found. Create your first task!' : 'No tasks match your filters.'}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} className="p-6 hover:bg-gray-50">
              {editingTask?._id === task._id ? (
                <EditTaskForm
                  task={task}
                  projects={projects}
                  developers={developers}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingTask(null)}
                  isLoading={updateMutation.isLoading}
                />
              ) : (
                <TaskCard
                  task={task}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDelete(task._id)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({ task, onEdit, onDelete }) {
  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };

  const priorityIcons = {
    low: '⬇️',
    medium: '🔷',
    high: '⚠️',
    urgent: '🚨',
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-start space-x-3 mb-2">
          <span className={`text-sm ${priorityColors[task.priority]}`}>
            {priorityIcons[task.priority]}
          </span>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                {task.status.replace('-', ' ')}
              </span>
              {isOverdue && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  Overdue
                </span>
              )}
            </div>
            
            {task.description && (
              <p className="text-gray-600 mb-2">{task.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>
                <strong>Project:</strong> {task.project?.title || 'N/A'}
              </span>
              <span>
                <strong>Assigned to:</strong> {task.assignedTo?.name || 'Unassigned'}
              </span>
              <span>
                <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
              </span>
              <span>
                <strong>Created by:</strong> {task.createdBy?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={onEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Edit Task Form Component
function EditTaskForm({ task, projects, developers, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate.split('T')[0],
    assignedTo: task.assignedTo?._id || '',
    project: task.project?._id || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
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
            Project *
          </label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date *
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign To *
        </label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Developer</option>
          {developers.map(dev => (
            <option key={dev._id} value={dev._id}>
              {dev.name} ({dev.email})
            </option>
          ))}
        </select>
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