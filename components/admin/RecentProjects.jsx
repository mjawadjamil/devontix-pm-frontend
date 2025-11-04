'use client';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';
import Link from 'next/link';

export default function RecentProjects() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
  });

  const recentProjects = dashboardData?.data?.recentProjects || [];

  const statusColors = {
    planning: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
        <Link href="/admin/projects" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentProjects.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No projects found</p>
        ) : (
          recentProjects.map((project) => (
            <div key={project._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <p className="text-sm text-gray-500">
                  {project.assignedDevs?.length || 0} developers assigned
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
                {project.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}