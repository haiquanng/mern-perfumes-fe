import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
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
import { perfumeSchema } from '../../validators/perfume';

interface Perfume {
  _id: string;
  perfumeName: string;
  brand: string | { _id: string; brandName: string };
  price: number;
  concentration: string;
  description: string;
  ingredients?: string;
  volume: number;
  stock: number;
  targetAudience: string;
  uri?: string;
  averageRating: number;
}

interface Brand {
  _id: string;
  brandName: string;
}

export default function AdminPerfumes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [showDialog, setShowDialog] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState<{ id: string; data: any } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    perfumeName: '',
    brand: '',
    price: '',
    concentration: '',
    description: '',
    ingredients: '',
    volume: '',
    stock: '',
    targetAudience: '',
    uri: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: perfumes = [], isLoading } = useQuery<Perfume[]>({
    queryKey: ['perfumes'],
    queryFn: async () => {
      const { data } = await api.get('/perfumes');
      return data;
    },
  });

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await api.get('/brands');
      return data;
    },
  });

  const parseAndSetErrors = (error: any) => {
    const serverErrors = error?.response?.data?.errors || error?.response?.data;
    let fieldMap: Record<string, string> = {};
    if (Array.isArray(serverErrors)) {
      fieldMap = serverErrors.reduce((acc: Record<string, string>, err: any) => {
        const raw = (err.field || '').toString();
        const key = raw.includes('.') ? raw.split('.').pop() : raw; // e.g. body.uri -> uri
        if (key) acc[key] = err.message || 'Invalid';
        return acc;
      }, {});
    }
    setFormErrors(fieldMap);

    const firstMsg = Array.isArray(serverErrors) && serverErrors[0]?.message
      ? serverErrors[0].message
      : (error?.response?.data?.message || 'Validation failed');
    toast({ title: 'Validation error', description: firstMsg });
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post('/perfumes', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
      toast({ title: 'Perfume created', description: 'Perfume has been added successfully.' });
      setShowDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      parseAndSetErrors(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await api.put(`/perfumes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
      toast({ title: 'Perfume updated', description: 'Perfume has been updated successfully.' });
      setShowDialog(false);
      setEditingPerfume(null);
      resetForm();
    },
    onError: (error: any) => {
      parseAndSetErrors(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/perfumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
      toast({ title: 'Perfume deleted', description: 'Perfume has been removed successfully.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete',
        description: error?.response?.data?.message || 'Failed to delete perfume',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      perfumeName: '',
      brand: '',
      price: '',
      concentration: '',
      description: '',
      ingredients: '',
      volume: '',
      stock: '',
      targetAudience: '',
      uri: '',
    });
    setFormErrors({});
  };

  const handleEdit = (perfume: Perfume) => {
    setEditingPerfume(perfume);
    setFormData({
      perfumeName: perfume.perfumeName,
      brand: typeof perfume.brand === 'object' ? perfume.brand._id : perfume.brand,
      price: perfume.price.toString(),
      concentration: perfume.concentration,
      description: perfume.description,
      ingredients: perfume.ingredients || '',
      volume: perfume.volume.toString(),
      stock: perfume.stock.toString(),
      targetAudience: perfume.targetAudience,
      uri: perfume.uri || '',
    });
    setFormErrors({});
    setShowDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    const submitData = {
      perfumeName: formData.perfumeName,
      brand: formData.brand,
      price: parseFloat(formData.price),
      concentration: formData.concentration,
      description: formData.description,
      ingredients: formData.ingredients,
      volume: parseInt(formData.volume),
      stock: parseInt(formData.stock),
      targetAudience: formData.targetAudience,
      uri: formData.uri || undefined,
    };

    // Client-side validation with Zod
    const parsed = perfumeSchema.safeParse(submitData);
    if (!parsed.success) {
      const fieldMap: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString();
        if (key) fieldMap[key] = issue.message;
      }
      setFormErrors(fieldMap);
      const first = parsed.error.issues[0];
      toast({ title: 'Validation error', description: first?.message || 'Please check your input' });
      return;
    }

    if (editingPerfume) {
      setPendingUpdateData({ id: editingPerfume._id, data: submitData });
      setShowUpdateDialog(true);
    } else {
      createMutation.mutate(submitData);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const filteredPerfumes = perfumes
    .filter(
    (perfume) =>
      perfume.perfumeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof perfume.brand === 'object' ? perfume.brand.brandName : perfume.brand)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  )
    .filter((p) => {
      if (brandFilter === 'all') return true;
      const brandId = typeof p.brand === 'object' ? p.brand._id : p.brand;
      return brandId === brandFilter || (typeof p.brand === 'object' && p.brand.brandName === brandFilter);
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.averageRating - a.averageRating;
      if (sortBy === 'rating-asc') return a.averageRating - b.averageRating;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredPerfumes.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedPerfumes = filteredPerfumes.slice(startIdx, startIdx + pageSize);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Perfumes</h1>
        <p className="text-gray-600 mt-1">Add, edit, or remove perfumes from the catalog</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Perfumes</CardTitle>
              <CardDescription>{perfumes.length} total perfumes</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search perfumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={brandFilter} onValueChange={(v) => { setBrandFilter(v); setPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All brands</SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b._id} value={b._id}>{b.brandName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                  <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={showDialog} onOpenChange={(open) => {
                setShowDialog(open);
                if (!open) {
                  setEditingPerfume(null);
                  resetForm();
                }
              }}>
                <DialogTrigger onClick={() => resetForm()} className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                  <span className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Perfume
                  </span>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      {editingPerfume ? 'Edit Perfume' : 'Add New Perfume'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPerfume ? 'Update perfume information' : 'Create a new perfume entry'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Perfume Name *</Label>
                        <Input
                          value={formData.perfumeName}
                          onChange={(e) => setFormData({ ...formData, perfumeName: e.target.value })}
                          required
                          className={formErrors.perfumeName ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {formErrors.perfumeName && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.perfumeName}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Brand *</Label>
                        <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                          <SelectTrigger className={formErrors.brand ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand._id} value={brand._id}>
                                {brand.brandName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.brand && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.brand}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Price *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                          className={formErrors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {formErrors.price && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Volume (ml) *</Label>
                        <Input
                          type="number"
                          value={formData.volume}
                          onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                          required
                          className={formErrors.volume ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {formErrors.volume && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.volume}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Stock *</Label>
                        <Input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          required
                          className={formErrors.stock ? 'border-red-500 focus-visible:ring-red-500' : ''}
                        />
                        {formErrors.stock && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.stock}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Concentration *</Label>
                        <Select
                          value={formData.concentration}
                          onValueChange={(value) => setFormData({ ...formData, concentration: value })}
                        >
                          <SelectTrigger className={formErrors.concentration ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                            <SelectValue placeholder="Select concentration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EDP">EDP (Eau de Parfum)</SelectItem>
                            <SelectItem value="EDT">EDT (Eau de Toilette)</SelectItem>
                            <SelectItem value="EDC">EDC (Eau de Cologne)</SelectItem>
                            <SelectItem value="Parfum">Parfum</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.concentration && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.concentration}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Target Audience *</Label>
                        <Select
                          value={formData.targetAudience}
                          onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                        >
                          <SelectTrigger className={formErrors.targetAudience ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.targetAudience && (
                          <p className="mt-1 text-xs text-red-600">{formErrors.targetAudience}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Description *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required
                        className={formErrors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {formErrors.description && (
                        <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Ingredients</Label>
                      <Input
                        value={formData.ingredients}
                        onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                        placeholder="Comma-separated ingredients"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Image URL</Label>
                      <Input
                        value={formData.uri}
                        onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className={formErrors.uri ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                      {formErrors.uri && (
                        <p className="mt-1 text-xs text-red-600">Invalid image URL</p>
                      )}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {editingPerfume ? 'Update Perfume' : 'Create Perfume'}
                      </Button>
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
                  <TableHead className="text-gray-600">Name</TableHead>
                  <TableHead className="text-gray-600">Brand</TableHead>
                  <TableHead className="text-gray-600">Price</TableHead>
                  <TableHead className="text-gray-600">Stock</TableHead>
                  <TableHead className="text-gray-600">Rating</TableHead>
                  <TableHead className="text-gray-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPerfumes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                      No perfumes found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPerfumes.map((perfume) => (
                    <TableRow key={perfume._id}>
                      <TableCell className="font-medium">{perfume.perfumeName}</TableCell>
                      <TableCell>
                        {typeof perfume.brand === 'object' ? perfume.brand.brandName : perfume.brand}
                      </TableCell>
                      <TableCell>${perfume.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={perfume.stock > 10 ? 'default' : perfume.stock > 0 ? 'secondary' : 'destructive'}>
                          {perfume.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>{perfume.averageRating.toFixed(1)}</TableCell>
                       <TableCell className="text-right">
                         <div className="inline-flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(perfume)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setDeleteId(perfume._id); setShowDeleteDialog(true); }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          {/* Pagination */}
          {!isLoading && filteredPerfumes.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {startIdx + 1}-{Math.min(startIdx + pageSize, filteredPerfumes.length)} of {filteredPerfumes.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Confirm Delete Dialog */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete perfume?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The perfume will be permanently removed.
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

          {/* Confirm Update Dialog */}
          <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to update this perfume. Do you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (pendingUpdateData) {
                      updateMutation.mutate(pendingUpdateData);
                      setShowUpdateDialog(false);
                    }
                  }}
                >
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
