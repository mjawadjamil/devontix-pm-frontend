'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Devontix</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.name}</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {user?.role}
            </span>
            <button 
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}