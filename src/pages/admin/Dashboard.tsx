import { Link } from 'react-router-dom';
import { mockPerfumes, mockBrands, mockMembers } from '../../api/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TrendingUp, AlertCircle, DollarSign, ShoppingBag, Users, Package, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  // Calculate stats
  const totalRevenue = mockPerfumes.reduce((sum, p) => sum + (p.price * (100 - p.stock)), 0);
  const avgRating = mockPerfumes.reduce((sum, p) => sum + p.averageRating, 0) / mockPerfumes.length;
  const lowStockCount = mockPerfumes.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = mockPerfumes.filter(p => p.stock === 0).length;
  const inStockCount = mockPerfumes.filter(p => p.stock > 10).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {mockPerfumes.length}
            </div>
            <p className="text-sm font-medium text-gray-700">Total Products</p>
            <p className="text-xs text-gray-500 mt-2">
              Across {mockBrands.length} brands
            </p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18%
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${totalRevenue.toFixed(0)}
            </div>
            <p className="text-sm font-medium text-gray-700">Revenue (Est.)</p>
            <p className="text-xs text-gray-500 mt-2">
              Based on sales
            </p>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                Excellent
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {avgRating.toFixed(1)}
            </div>
            <p className="text-sm font-medium text-gray-700">Average Rating</p>
            <p className="text-xs text-gray-500 mt-2">
              Across all products
            </p>
          </CardContent>
        </Card>

        {/* Members */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8%
              </Badge>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {mockMembers.length}
            </div>
            <p className="text-sm font-medium text-gray-700">Total Members</p>
            <p className="text-xs text-gray-500 mt-2">
              {mockMembers.filter(m => m.isAdmin).length} admins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Stock Alerts
            </CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Out of Stock</p>
                    <p className="text-xs text-gray-600">Needs immediate restocking</p>
                  </div>
                </div>
                <Badge variant="destructive" className="font-semibold">
                  {outOfStockCount}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Low Stock</p>
                    <p className="text-xs text-gray-600">Below 10 units</p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-semibold">
                  {lowStockCount}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">In Stock</p>
                    <p className="text-xs text-gray-600">Adequate inventory</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                  {inStockCount}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/perfumes">
              <Button className="w-full justify-start h-auto py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm">
                <Package className="w-5 h-5 mr-3" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Manage Perfumes</div>
                  <div className="text-xs opacity-90">Add, edit, or remove perfumes</div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/admin/users">
              <Button variant="outline" className="w-full justify-start h-auto py-4 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50">
                <Users className="w-5 h-5 mr-3 text-blue-600" />
                <div className="text-left flex-1">
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-xs text-gray-600">View and manage all members</div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}