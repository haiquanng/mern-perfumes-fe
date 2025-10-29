import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Users,
  Settings,
  BarChart3,
  Package
} from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';
import { LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/perfumes', label: 'Perfumes', icon: ShoppingBag },
    { path: '/admin/brands', label: 'Brands', icon: Tags },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            Admin Panel
          </h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Spacer to push logout to bottom */}
        <div className="h-40" />
      </div>

      {/* Logout footer */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <button
          onClick={async () => { await logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
