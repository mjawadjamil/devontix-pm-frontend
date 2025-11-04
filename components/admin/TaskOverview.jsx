'use client';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';

export default function TaskOverview() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
  });

  const tasksByStatus = dashboardData?.data?.tasks?.byStatus || {};
  const tasksByPriority = dashboardData?.data?.tasks?.byPriority || {};

  const statusData = [
    { name: 'To Do', value: tasksByStatus.todo || 0, color: 'bg-gray-500' },
    { name: 'In Progress', value: tasksByStatus['in-progress'] || 0, color: 'bg-blue-500' },
    { name: 'Review', value: tasksByStatus.review || 0, color: 'bg-yellow-500' },
    { name: 'Done', value: tasksByStatus.done || 0, color: 'bg-green-500' },
  ];

  const priorityData = [
    { name: 'Low', value: tasksByPriority.low || 0, color: 'bg-gray-400' },
    { name: 'Medium', value: tasksByPriority.medium || 0, color: 'bg-blue-400' },
    { name: 'High', value: tasksByPriority.high || 0, color: 'bg-orange-400' },
    { name: 'Urgent', value: tasksByPriority.urgent || 0, color: 'bg-red-500' },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">By Status</h4>
          <div className="space-y-2">
            {statusData.map((status) => (
              <div key={status.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{status.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{status.value}</span>
                  <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-3">By Priority</h4>
          <div className="space-y-2">
            {priorityData.map((priority) => (
              <div key={priority.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{priority.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{priority.value}</span>
                  <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}