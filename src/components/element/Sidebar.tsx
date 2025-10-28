import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Users,
  Settings,
  BarChart3,
  Package
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/perfumes', label: 'Perfumes', icon: ShoppingBag },
    { path: '/admin/brands', label: 'Brands', icon: Tags },
    { path: '/admin/members', label: 'Members', icon: Users },
    { path: '/admin/orders', label: 'Orders', icon: Package },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-16">
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
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
          <div className="text-sm font-semibold text-gray-900 mb-1">Quick Stats</div>
          <div className="text-xs text-gray-600 mb-3">Overview of your store</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Total Sales</span>
              <span className="font-semibold text-gray-900">$12,450</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Orders</span>
              <span className="font-semibold text-gray-900">148</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Products</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
