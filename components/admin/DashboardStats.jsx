'use client';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';

export default function DashboardStats() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load dashboard data
      </div>
    );
  }

  const { overview, projects, tasks } = dashboardData?.data || {};

  const stats = [
    {
      name: 'Total Projects',
      value: overview?.totalProjects || 0,
      icon: '📁',
      color: 'blue',
    },
    {
      name: 'Total Tasks',
      value: overview?.totalTasks || 0,
      icon: '✅',
      color: 'green',
    },
    {
      name: 'Total Users',
      value: overview?.totalUsers || 0,
      icon: '👥',
      color: 'purple',
    },
    {
      name: 'Overdue Tasks',
      value: overview?.overdueTasks || 0,
      icon: '⏰',
      color: 'red',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[stat.color]} bg-opacity-10`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}