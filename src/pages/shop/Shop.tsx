import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { usePerfumes } from '../../hooks/usePerfumes';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Pagination } from '../../components/ui/pagination';
import { Search, Star, Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

const DEFAULT_ITEMS_PER_PAGE = 12;

type Brand = { _id: string; brandName: string };

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAudience = searchParams.get('targetAudience') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialConcentration = searchParams.get('concentration') || 'all';
  const initialQ = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1') || 1;
  const initialLimit = parseInt(searchParams.get('limit') || String(DEFAULT_ITEMS_PER_PAGE)) || DEFAULT_ITEMS_PER_PAGE;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedConcentration, setSelectedConcentration] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(DEFAULT_ITEMS_PER_PAGE);

  // Initialize state from URL once
  useEffect(() => {
    setSelectedAudience(initialAudience);
    setSelectedBrand(initialBrand);
    setSelectedConcentration(initialConcentration);
    setSearchQuery(initialQ);
    setCurrentPage(initialPage);
    setItemsPerPage(initialLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: perfumes, isLoading } = usePerfumes({
    q: searchQuery,
    brand: selectedBrand !== 'all' ? selectedBrand : undefined,
    concentration: selectedConcentration !== 'all' ? selectedConcentration : undefined,
    targetAudience: selectedAudience !== 'all' ? selectedAudience : undefined,
  });

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['shop-brands'],
    queryFn: async () => {
      const { data } = await api.get('/brands');
      return data;
    },
  });

  // Filter and sort perfumes (client-side price range + sort)
  const filteredAndSortedPerfumes = useMemo(() => {
    if (!perfumes) return [];

    let filtered = perfumes.filter(perfume => {
      // Price range filter
      if (priceRange.min && perfume.price < parseFloat(priceRange.min)) return false;
      if (priceRange.max && perfume.price > parseFloat(priceRange.max)) return false;
      return true;
    });

    // Sort
    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.averageRating;
            bValue = b.averageRating;
            break;
          case 'name':
            aValue = a.perfumeName.toLowerCase();
            bValue = b.perfumeName.toLowerCase();
            break;
          default:
            return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return filtered;
  }, [perfumes, sortBy, sortOrder, priceRange]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPerfumes.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPerfumes = filteredAndSortedPerfumes.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedConcentration, selectedAudience, searchQuery, sortBy, sortOrder, priceRange, itemsPerPage]);

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Keep URL in sync with filters and pagination
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedBrand !== 'all') params.brand = selectedBrand;
    if (selectedConcentration !== 'all') params.concentration = selectedConcentration;
    if (selectedAudience !== 'all') params.targetAudience = selectedAudience;
    if (currentPage > 1) params.page = String(currentPage);
    if (itemsPerPage !== DEFAULT_ITEMS_PER_PAGE) params.limit = String(itemsPerPage);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedBrand, selectedConcentration, selectedAudience, currentPage, itemsPerPage, setSearchParams]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1.5 font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop Perfumes</h1>
          <p className="text-gray-600">Discover our complete collection of luxury fragrances</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Fixed */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <Card>
                <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-pink-600" />
                  Filters
                </h3>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search perfumes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.brandName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Concentration Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Concentration</label>
                  <Select value={selectedConcentration} onValueChange={setSelectedConcentration}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="EDP">EDP</SelectItem>
                      <SelectItem value="EDT">EDT</SelectItem>
                      <SelectItem value="EDC">EDC</SelectItem>
                      <SelectItem value="Parfum">Parfum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Audience Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="space-y-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                      </SelectContent>
                    </Select>
                    {sortBy !== 'default' && (
                      <div className="flex gap-2">
                        <Button
                          variant={sortOrder === 'asc' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSortOrder('asc')}
                          className="flex-1"
                        >
                          <SortAsc className="w-4 h-4 mr-1" />
                          Asc
                        </Button>
                        <Button
                          variant={sortOrder === 'desc' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSortOrder('desc')}
                          className="flex-1"
                        >
                          <SortDesc className="w-4 h-4 mr-1" />
                          Desc
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBrand('all');
                    setSelectedConcentration('all');
                    setSelectedAudience('all');
                    setSortBy('default');
                    setSortOrder('asc');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedPerfumes.length)} of {filteredAndSortedPerfumes.length} products
                </p>
                {(selectedBrand !== 'all' || selectedConcentration !== 'all' || selectedAudience !== 'all' || searchQuery || priceRange.min || priceRange.max) && (
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                    Filtered
                  </Badge>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                {/* Items per page selector */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 mr-2">
                  <span>Per page</span>
                  <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(parseInt(v))}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="12" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="36">36</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Top Pagination */}
            {!isLoading && filteredAndSortedPerfumes.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {/* Products Grid/List */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse border-0">
                    <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredAndSortedPerfumes.length === 0 ? (
              <Card className="border-0">
                <CardContent className="py-20 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('all');
                      setSelectedConcentration('all');
                      setSelectedAudience('all');
                      setSortBy('default');
                      setSortOrder('asc');
                      setPriceRange({ min: '', max: '' });
                    }}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {paginatedPerfumes.map((perfume) => (
                    <ProductCard
                      key={perfume._id}
                      perfume={perfume}
                      to={`/perfumes/${perfume._id}`}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
                {/* Bottom Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
