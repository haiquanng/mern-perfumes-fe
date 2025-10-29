import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePerfumes } from '../../hooks/usePerfumes';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Star, ArrowRight, TrendingUp, Crown, Sparkles } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

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
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white overflow-hidden">
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
                New Collection 2025
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
                <Link to="/shop" className="w-full">
                  <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50 h-12 px-8">
                    Shop Now
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold">{perfumes?.length || 0}+</div>
                  <div className="text-sm text-purple-200">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">10+</div>
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
                <img src="/images/banner.png" alt="Hero Image" className="w-140 h-140 object-contain" />
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
            <Link
              key={cat.id}
              to={cat.id ? `/shop?targetAudience=${cat.id}` : '/shop'}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:shadow'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
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
            <Link to="/shop">
              <Button variant="ghost" className="group text-pink-600 hover:text-pink-700">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((perfume, idx) => (
              <ProductCard
                key={perfume._id}
                perfume={perfume}
                to={`/perfumes/${perfume._id}`}
                highlightLabel={idx === 0 ? '#1 Bestseller' : null}
              />
            ))}
          </div>
        </section>

        {/* Featured Banner */}
        <section className="mb-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 p-12 md:p-16">
            <div className="relative z-10 max-w-2xl text-white">
              <Badge className="mb-4 bg-white/20 text-white border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                Limited Offer
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get 20% Off On Premium Collection
              </h2>
              <p className="text-lg text-pink-100 mb-6">
                Discover exclusive fragrances from luxury brands. Limited time offer!
              </p>
              <Link to="/shop">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50 h-12 px-8">
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
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
              {perfumes?.slice(0, 8).map((perfume) => (
                <ProductCard key={perfume._id} perfume={perfume} to={`/perfumes/${perfume._id}`} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
