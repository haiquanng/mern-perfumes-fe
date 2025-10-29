import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../../components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '../../components/ui/alert-dialog';

type Brand = { _id: string; brandName: string; country?: string; description?: string };
type Perfume = { _id: string; brand: string | { _id: string; brandName: string } };

export default function AdminBrands() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await api.get('/brands');
      return data;
    }
  });

  const { data: perfumes = [] } = useQuery<Perfume[]>({
    queryKey: ['perfumes'],
    queryFn: async () => {
      const { data } = await api.get('/perfumes');
      return data;
    }
  });

  const [formData, setFormData] = useState({
    brandName: '',
    country: '',
    description: ''
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/brands', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({ title: 'Brand created', description: 'Brand has been added.' });
      setShowDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Failed to create', description: error?.response?.data?.message || 'Error' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => api.put(`/brands/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({ title: 'Brand updated', description: 'Brand has been updated.' });
      setShowDialog(false);
      setEditingBrand(null);
      resetForm();
    },
    onError: (error: any) => toast({ title: 'Failed to update', description: error?.response?.data?.message || 'Error' })
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/brands/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({ title: 'Brand deleted', description: 'Brand has been removed.' });
    },
    onError: (error: any) => toast({ title: 'Failed to delete', description: error?.response?.data?.message || 'Error' })
  });

  const resetForm = () => setFormData({ brandName: '', country: '', description: '' });

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ brandName: brand.brandName, country: brand.country || '', description: brand.description || '' });
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { brandName: formData.brandName, country: formData.country || undefined, description: formData.description || undefined };
    if (editingBrand) updateMutation.mutate({ id: editingBrand._id, data });
    else createMutation.mutate(data);
  };

  const brandIdToPerfumeCount: Record<string, number> = perfumes.reduce((acc, p) => {
    const id = typeof p.brand === 'object' ? p.brand._id : p.brand;
    if (!acc[id]) acc[id] = 0;
    acc[id] += 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredBrands = brands.filter(b => b.brandName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Brands</h1>
        <p className="text-gray-600 mt-1">Add, edit, or remove perfume brands</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Brands</CardTitle>
              <CardDescription>{brands.length} total brands</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={showDialog} onOpenChange={(o) => { setShowDialog(o); if (!o) { setEditingBrand(null); resetForm(); } }}>
                <DialogTrigger 
                  className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => { setEditingBrand(null); resetForm(); }}
                >
                  <span className="flex items-center"><Plus className="w-4 h-4 mr-2" /> Add Brand</span>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
                    <DialogDescription>{editingBrand ? 'Update brand information' : 'Create a new perfume brand'}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Brand Name *</Label>
                      <Input value={formData.brandName} onChange={(e) => setFormData({ ...formData, brandName: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Country</Label>
                      <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                      <Button type="submit">{editingBrand ? 'Update' : 'Create'}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <Table className="[&_thead_tr]:border-gray-200 [&_tr]:border-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-gray-600">Brand</TableHead>
                  <TableHead className="text-gray-600">Country</TableHead>
                  <TableHead className="text-gray-600">Perfumes</TableHead>
                  <TableHead className="text-right text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-gray-500">No brands found</TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((brand) => {
                    const count = brandIdToPerfumeCount[brand._id] || 0;
                    return (
                      <TableRow key={brand._id}>
                        <TableCell className="font-medium">{brand.brandName}</TableCell>
                        <TableCell>{brand.country || 'N/A'}</TableCell>
                        <TableCell><Badge variant={count > 0 ? 'secondary' : 'default'}>{count}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(brand)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (count > 0) {
                                  toast({ title: 'Cannot delete brand', description: 'This brand has perfumes associated.', });
                                  return;
                                }
                                setDeleteId(brand._id);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete brand?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The brand will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => { if (deleteId) { deleteMutation.mutate(deleteId); setShowDeleteDialog(false); } }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}


