import DashboardStats from '../../../components/admin/DashboardStats';
import RecentProjects from '../../../components/admin/RecentProjects';
import TaskOverview from '../../../components/admin/TaskOverview';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your projects and tasks</p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects />
        <TaskOverview />
      </div>
    </div>
  );
}