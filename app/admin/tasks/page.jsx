import CreateTaskModal from "@/components/admin/CreateTaskModal";
import TasksList from "@/components/admin/TasksList";


export default function TasksPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks Management</h1>
          <p className="text-gray-600">Manage and assign tasks across all projects</p>
        </div>
        <CreateTaskModal />
      </div>
      
      <TasksList />
    </div>
  );
}