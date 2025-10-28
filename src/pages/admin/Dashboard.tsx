import { useState } from 'react';
import { mockPerfumes, mockBrands, mockMembers } from '../../api/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Package, Tag, Users, Plus, Edit, Trash2, TrendingUp, AlertCircle, DollarSign, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [editingPerfume, setEditingPerfume] = useState<string | null>(null);
  const [showAddBrandDialog, setShowAddBrandDialog] = useState(false);
  const [showAddPerfumeDialog, setShowAddPerfumeDialog] = useState(false);

  // Calculate stats
  const totalRevenue = mockPerfumes.reduce((sum, p) => sum + (p.price * (100 - p.stock)), 0);
  const avgRating = mockPerfumes.reduce((sum, p) => sum + p.averageRating, 0) / mockPerfumes.length;
  const lowStockCount = mockPerfumes.filter(p => p.stock > 0 && p.stock <= 10).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="perfumes">Perfumes</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Products */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {mockPerfumes.length}
                  </div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Across {mockBrands.length} brands
                  </p>
                </CardContent>
              </Card>

              {/* Revenue */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +18%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${totalRevenue.toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600">Revenue (Est.)</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on sales
                  </p>
                </CardContent>
              </Card>

              {/* Average Rating */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      Excellent
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {avgRating.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Across all products
                  </p>
                </CardContent>
              </Card>

              {/* Members */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {mockMembers.length}
                  </div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {mockMembers.filter(m => m.isAdmin).length} admins
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stock Alerts */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Stock Alerts
                  </CardTitle>
                  <CardDescription>Products requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Out of Stock</p>
                          <p className="text-xs text-gray-600">Needs immediate restocking</p>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        {mockPerfumes.filter(p => p.stock === 0).length}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Low Stock</p>
                          <p className="text-xs text-gray-600">Below 10 units</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">
                        {lowStockCount}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">In Stock</p>
                          <p className="text-xs text-gray-600">Adequate inventory</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {mockPerfumes.filter(p => p.stock > 10).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start h-auto py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => { setActiveTab('perfumes'); setShowAddPerfumeDialog(true); }}
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Add New Perfume</div>
                      <div className="text-xs opacity-90">Create a new product listing</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-4 border-2"
                    onClick={() => { setActiveTab('brands'); setShowAddBrandDialog(true); }}
                  >
                    <Tag className="w-5 h-5 mr-3 text-purple-600" />
                    <div className="text-left">
                      <div className="font-semibold">Add New Brand</div>
                      <div className="text-xs text-gray-600">Register a fragrance house</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-4 border-2"
                    onClick={() => setActiveTab('members')}
                  >
                    <Users className="w-5 h-5 mr-3 text-purple-600" />
                    <div className="text-left">
                      <div className="font-semibold">View Members</div>
                      <div className="text-xs text-gray-600">See all registered users</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Perfumes Tab */}
          <TabsContent value="perfumes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manage Perfumes</CardTitle>
                    <CardDescription>Add, edit, or remove perfumes from the catalog</CardDescription>
                  </div>
                  <Dialog open={showAddPerfumeDialog} onOpenChange={setShowAddPerfumeDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Perfume
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Perfume</DialogTitle>
                        <DialogDescription>Create a new perfume entry</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Perfume Name</Label>
                          <Input placeholder="Enter perfume name" />
                        </div>
                        <div>
                          <Label>Brand</Label>
                          <Select>
                            <option value="">Select brand</option>
                            {mockBrands.map(b => <option key={b._id} value={b._id}>{b.brandName}</option>)}
                          </Select>
                        </div>
                        <div>
                          <Label>Price</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                        <Button className="w-full">Create Perfume</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPerfumes.map((perfume) => (
                      <TableRow key={perfume._id}>
                        <TableCell className="font-medium">{perfume.perfumeName}</TableCell>
                        <TableCell>{typeof perfume.brand === 'object' ? perfume.brand.brandName : perfume.brand}</TableCell>
                        <TableCell>${perfume.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={perfume.stock > 10 ? 'default' : perfume.stock > 0 ? 'secondary' : 'destructive'}>
                            {perfume.stock}
                          </Badge>
                        </TableCell>
                        <TableCell>{perfume.averageRating.toFixed(1)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brands">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manage Brands</CardTitle>
                    <CardDescription>Add, edit, or remove perfume brands</CardDescription>
                  </div>
                  <Dialog open={showAddBrandDialog} onOpenChange={setShowAddBrandDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Brand
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Brand</DialogTitle>
                        <DialogDescription>Create a new perfume brand</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Brand Name</Label>
                          <Input placeholder="Enter brand name" />
                        </div>
                        <div>
                          <Label>Country</Label>
                          <Input placeholder="e.g., France" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea placeholder="Enter brand description" rows={3} />
                        </div>
                        <Button className="w-full">Create Brand</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Brand Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Perfumes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBrands.map((brand) => (
                      <TableRow key={brand._id}>
                        <TableCell className="font-medium">{brand.brandName}</TableCell>
                        <TableCell>{brand.country || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge>{mockPerfumes.filter(p => typeof p.brand === 'object' && p.brand._id === brand._id).length}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>All Members</CardTitle>
                <CardDescription>View registered members (read-only)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Year of Birth</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMembers.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.yob || 'N/A'}</TableCell>
                        <TableCell>{member.gender === true ? 'Male' : member.gender === false ? 'Female' : 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={member.isAdmin ? 'default' : 'secondary'}>
                            {member.isAdmin ? 'Admin' : 'Member'}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}


