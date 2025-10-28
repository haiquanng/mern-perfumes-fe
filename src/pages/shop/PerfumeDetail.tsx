import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { mockPerfumes, mockComments, mockAISummaries } from '../../api/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import CommentSection from '../../components/CommentSection';
import { Star, Package, Droplet, Users, Sparkles, ChevronRight, Heart, Share2, ShoppingCart, Shield, Truck, RotateCcw } from 'lucide-react';

export default function PerfumeDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');

  // Try API first, fallback to mock data
  const { data: perfume, isLoading } = useQuery({
    queryKey: ['perfume', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/perfumes/${id}`);
        return res.data;
      } catch {
        return mockPerfumes.find(p => p._id === id);
      }
    },
    enabled: !!id
  });

  const { data: aiData } = useQuery({
    queryKey: ['ai-summary', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/ai/summary/${id}`);
        return res.data;
      } catch {
        return mockAISummaries.find(s => s.perfumeId === id);
      }
    },
    enabled: !!id
  });

  // Get comments for this perfume
  const comments = mockComments.filter(c => c.perfume === id);

  // Get similar perfumes
  const similarPerfumes = aiData?.similarPerfumes
    ? mockPerfumes.filter(p => aiData.similarPerfumes.includes(p._id))
    : [];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-lg text-gray-600 ml-2">
          {rating.toFixed(1)} ({comments.length} reviews)
        </span>
      </div>
    );
  };

  const getBrandName = (brand: any) => {
    return typeof brand === 'object' ? brand.brandName : brand;
  };

  const getBrandInfo = (brand: any) => {
    return typeof brand === 'object' ? brand : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">Perfume not found</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brandInfo = getBrandInfo(perfume.brand);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{perfume.perfumeName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden relative group">
              <img
                src={perfume.uri}
                alt={perfume.perfumeName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <Badge variant="secondary" className="mb-3 text-sm">
                {getBrandName(perfume.brand)}
                {brandInfo?.country && ` • ${brandInfo.country}`}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {perfume.perfumeName}
              </h1>
              {renderStars(perfume.averageRating)}
            </div>

            {/* Price & Stock */}
            <div className="flex items-center gap-4 py-4 border-y">
              <div className="text-4xl font-bold text-gray-900">
                ${perfume.price.toFixed(2)}
              </div>
              <Badge
                variant={perfume.stock > 0 ? 'default' : 'destructive'}
                className="text-sm px-4 py-1.5"
              >
                {perfume.stock > 0 ? `${perfume.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>

            {/* Product Specs */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Droplet className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-gray-500 mb-1">Concentration</div>
                <div className="font-semibold text-sm">{perfume.concentration}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-gray-500 mb-1">Volume</div>
                <div className="font-semibold text-sm">{perfume.volume} ml</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-gray-500 mb-1">For</div>
                <div className="font-semibold text-sm capitalize">{perfume.targetAudience}</div>
              </div>
            </div>

            {/* Description Preview */}
            <div>
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {perfume.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-14 text-lg"
                disabled={perfume.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {perfume.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12"
              >
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-600">Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3">
              Description
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3">
              Ingredients
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3">
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3">
              Reviews ({comments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Perfume</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{perfume.description}</p>
              </div>
              {brandInfo?.description && (
                <div className="pt-6 border-t">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    About {getBrandName(perfume.brand)}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{brandInfo.description}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ingredients" className="mt-8">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Fragrance Notes</h3>
              {perfume.ingredients ? (
                <div className="flex flex-wrap gap-3">
                  {perfume.ingredients.split(',').map((ingredient, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100">
                      {ingredient.trim()}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No ingredient information available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="mt-8">
            <div className="space-y-8">
              {aiData?.summary && (
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h3 className="text-2xl font-bold text-gray-900">AI Review Summary</h3>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
                    <p className="text-gray-700 leading-relaxed text-lg">{aiData.summary}</p>
                  </div>
                </div>
              )}

              {similarPerfumes.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarPerfumes.map((similar) => (
                      <Link key={similar._id} to={`/perfumes/${similar._id}`}>
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
                          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                            <img
                              src={similar.uri}
                              alt={similar.perfumeName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-5">
                            <Badge variant="secondary" className="mb-2 text-xs">
                              {getBrandName(similar.brand)}
                            </Badge>
                            <h5 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                              {similar.perfumeName}
                            </h5>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-gray-900">
                                ${similar.price.toFixed(2)}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">{similar.averageRating.toFixed(1)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!aiData && (
                <div className="max-w-3xl text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">AI insights are not available for this perfume yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <CommentSection
              perfumeId={id || ''}
              comments={comments}
              onAddComment={(rating, content) => {
                console.log('New comment:', { rating, content });
                // In real app, this would call the API
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


