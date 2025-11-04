'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { useState } from 'react';

export default function UsersList() {
  const [editingUser, setEditingUser] = useState(null);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => userService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setEditingUser(null);
    },
  });

  const users = usersData?.data?.users || [];

  const roleColors = {
    Admin: 'bg-purple-100 text-purple-800',
    Developer: 'bg-blue-100 text-blue-800',
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role: newRole });
    } catch (error) {
      alert('Failed to update user role');
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
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load users
      </div>
    );
  }

  const adminCount = users.filter(user => user.role === 'Admin').length;
  const developerCount = users.filter(user => user.role === 'Developer').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{adminCount}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">👑</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Developers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{developerCount}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">💻</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            All Users ({users.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {user.name}
                        {editingUser?._id === user._id && (
                          <span className="ml-2 text-xs text-blue-600">(Editing)</span>
                        )}
                      </h4>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {editingUser?._id === user._id ? (
                      <EditRoleForm
                        user={user}
                        onSave={(newRole) => handleRoleUpdate(user._id, newRole)}
                        onCancel={() => setEditingUser(null)}
                        isLoading={updateRoleMutation.isLoading}
                      />
                    ) : (
                      <>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit role"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Edit Role Form Component
function EditRoleForm({ user, onSave, onCancel, isLoading }) {
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole !== user.role) {
      onSave(selectedRole);
    } else {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option value="Admin">Admin</option>
        <option value="Developer">Developer</option>
      </select>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}