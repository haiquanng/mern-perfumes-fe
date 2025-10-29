import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TrendingUp, AlertCircle, DollarSign, ShoppingBag, Users, Package, ArrowRight, Star, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data as {
        overview: {
          totalUsers: number;
          totalProducts: number;
          totalBrands: number;
          totalComments: number;
          averageRatingAcrossAllProducts: number;
          productsWithRatings: number;
          recentUsersCount: number;
        };
        topRatedProducts: Array<{ id: string; name: string; brand: string; rating: number; image: string }>;
        mostReviewedProducts: Array<{ id: string; name: string; brand: string; rating: number; commentCount: number; image: string }>;
      };
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your store performance</p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-100 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
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
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.overview.totalProducts}</div>
              <p className="text-sm font-medium text-gray-700">Total Products</p>
              <p className="text-xs text-gray-500 mt-2">Across {stats.overview.totalBrands} brands</p>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Quality</Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.overview.averageRatingAcrossAllProducts.toFixed(2)}</div>
              <p className="text-sm font-medium text-gray-700">Average Rating</p>
              <p className="text-xs text-gray-500 mt-2">{stats.overview.productsWithRatings} products with ratings</p>
            </CardContent>
          </Card>

          {/* Total Members */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">+{stats.overview.recentUsersCount} this week</Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.overview.totalUsers}</div>
              <p className="text-sm font-medium text-gray-700">Total Members</p>
              <p className="text-xs text-gray-500 mt-2">Recent signups in last 7 days</p>
            </CardContent>
          </Card>

          {/* Total Comments */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Active</Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.overview.totalComments}</div>
              <p className="text-sm font-medium text-gray-700">Total Reviews</p>
              <p className="text-xs text-gray-500 mt-2">Across all products</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lists */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Rated Products */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900">Top Rated Products</CardTitle>
              <CardDescription>Highest rated perfumes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topRatedProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50/50">
                    <img src={p.image} alt={p.name} className="w-14 h-14 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{p.name}</div>
                      <div className="text-xs text-gray-600 truncate">{p.brand}</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">{p.rating.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Reviewed Products */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900">Most Reviewed</CardTitle>
              <CardDescription>Products with most comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.mostReviewedProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50/50">
                    <img src={p.image} alt={p.name} className="w-14 h-14 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{p.name}</div>
                      <div className="text-xs text-gray-600 truncate">{p.brand}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-blue-200 text-blue-700">{p.rating.toFixed(2)}</Badge>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">{p.commentCount} reviews</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
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

        {/* Stock Alerts Placeholder (optional retain) */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Stock Alerts
            </CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">This section can be connected to inventory data later.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}