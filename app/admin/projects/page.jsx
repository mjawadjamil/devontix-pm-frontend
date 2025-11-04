import CreateProjectModal from "@/components/admin/CreateProjectModal";
import ProjectsList from "@/components/admin/ProjectList";


export default function ProjectsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage all projects and assignments</p>
        </div>
        <CreateProjectModal />
      </div>
      
      <ProjectsList />
    </div>
  );
}