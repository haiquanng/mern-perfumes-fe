import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePerfumes } from '../../hooks/usePerfumes';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Star, ArrowRight, TrendingUp, Crown, Sparkles } from 'lucide-react';

export default function Home() {
  const [q, setQ] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { data: perfumes, isLoading } = usePerfumes({ q, targetAudience: selectedCategory });

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

  const getBrandName = (brand: any) => {
    return typeof brand === 'object' ? brand.brandName : brand;
  };

  const categories = [
    { id: '', label: 'All', icon: '✨' },
    { id: 'female', label: 'Women', icon: '👩' },
    { id: 'male', label: 'Men', icon: '👨' },
    { id: 'unisex', label: 'Unisex', icon: '🌟' }
  ];

  const featuredPerfumes = perfumes?.filter(p => p.averageRating >= 4.7).slice(0, 6) || [];
  const bestSellers = perfumes?.slice(0, 4) || [];
  const newArrivals = perfumes?.slice(4, 8) || [];

  return (
    <div className="bg-white">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur">
                <Sparkles className="w-3 h-3 mr-1" />
                New Collection 2024
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
                  Perfect Scent
                </span>
              </h1>

              <p className="text-xl text-purple-100 mb-8 max-w-xl">
                Explore luxury fragrances from world's most prestigious brands.
                Find your signature scent today.
              </p>

              {/* Hero Search */}
              <div className="max-w-xl">
                <div className="flex gap-2 bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                    <Input
                      placeholder="Search for perfumes..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      className="h-12 pl-12 bg-white/5 border-0 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                    />
                  </div>
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 h-12 px-8">
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold">{perfumes?.length || 0}+</div>
                  <div className="text-sm text-purple-200">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-purple-200">Brands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">10k+</div>
                  <div className="text-sm text-purple-200">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block relative">
              <div className="relative">
                {featuredPerfumes.slice(0, 1).map(perfume => (
                  <div key={perfume._id} className="relative group">
                    <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl group-hover:bg-white/30 transition"></div>
                    <img
                      src={perfume.uri}
                      alt={perfume.perfumeName}
                      className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248 250 252)"/>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:shadow'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Best Sellers */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-amber-500" />
                <h2 className="text-3xl font-bold text-gray-900">Bestsellers</h2>
              </div>
              <p className="text-gray-600">Most loved fragrances by our customers</p>
            </div>
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((perfume, idx) => (
              <Link key={perfume._id} to={`/perfumes/${perfume._id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
                  {idx === 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      #1 Bestseller
                    </div>
                  )}

                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <img
                      src={perfume.uri}
                      alt={perfume.perfumeName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {getBrandName(perfume.brand)}
                    </Badge>
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                      {perfume.perfumeName}
                    </h3>
                    {renderStars(perfume.averageRating)}
                    <div className="flex items-baseline justify-between mt-3">
                      <span className="text-2xl font-bold text-gray-900">
                        ${perfume.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">{perfume.volume}ml</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Banner */}
        <section className="mb-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-12 md:p-16">
            <div className="relative z-10 max-w-2xl text-white">
              <Badge className="mb-4 bg-white/20 text-white border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                Limited Offer
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get 20% Off On Premium Collection
              </h2>
              <p className="text-lg text-purple-100 mb-6">
                Discover exclusive fragrances from luxury brands. Limited time offer!
              </p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50">
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}></div>
            </div>
          </div>
        </section>

        {/* All Products */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Products</h2>
              <p className="text-gray-600">{perfumes?.length || 0} fragrances available</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          ) : perfumes?.length === 0 ? (
            <Card className="border-0">
              <CardContent className="py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <Button onClick={() => { setQ(''); setSelectedCategory(''); }}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {perfumes?.map((perfume) => (
                <Link key={perfume._id} to={`/perfumes/${perfume._id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden h-full">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                      <img
                        src={perfume.uri}
                        alt={perfume.perfumeName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {perfume.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {getBrandName(perfume.brand)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {perfume.concentration}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-base mb-2 line-clamp-2 h-12 group-hover:text-purple-600 transition">
                        {perfume.perfumeName}
                      </h3>

                      {renderStars(perfume.averageRating)}

                      <div className="flex items-baseline justify-between mt-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ${perfume.price.toFixed(2)}
                        </span>
                        {perfume.stock > 0 && (
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
