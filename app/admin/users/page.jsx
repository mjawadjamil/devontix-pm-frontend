import UsersList from "@/components/admin/UsersList";


export default function UsersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>
      
      <UsersList />
    </div>
  );
}