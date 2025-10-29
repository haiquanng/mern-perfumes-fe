import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import type { Perfume } from '../api/mockData';

type ProductCardProps = {
  perfume: Perfume;
  to?: string;
  variant?: 'default' | 'compact';
  viewMode?: 'grid' | 'list';
  highlightLabel?: string | null;
};

export default function ProductCard({ perfume, to, variant = 'default', viewMode = 'grid', highlightLabel }: ProductCardProps) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    to ? <Link to={to} className="block h-full">{children}</Link> : <>{children}</>;

  const getBrandName = (brand: any) => (typeof brand === 'object' ? brand.brandName : brand);

  const rating = (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(perfume.averageRating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="text-xs text-gray-600 ml-1.5 font-medium">{perfume.averageRating.toFixed(1)}</span>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <Wrapper>
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
          <div className="flex">
            <div className="w-48 h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex-shrink-0">
              <img
                src={perfume.uri}
                alt={perfume.perfumeName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {perfume.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            <CardContent className="p-6 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {getBrandName(perfume.brand)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {perfume.concentration}
                  </Badge>
                </div>
                {highlightLabel && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
                    {highlightLabel}
                  </Badge>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-2 group-hover:text-pink-600 transition">
                {perfume.perfumeName}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {perfume.description || 'A luxurious fragrance that captivates the senses with its unique blend of notes.'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {rating}
                  <span className="text-2xl font-bold text-gray-900">${perfume.price.toFixed(2)}</span>
                </div>
                {perfume.stock > 0 && (
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    Add to Cart
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden ${
        variant === 'compact' ? '' : 'h-full'
      }`}>
        {highlightLabel && (
          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            {highlightLabel}
          </div>
        )}

        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          <img
            src={perfume.uri}
            alt={perfume.perfumeName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {perfume.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className="p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {getBrandName(perfume.brand)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {perfume.concentration}
            </Badge>
          </div>

          <h3 className={`font-semibold mb-2 group-hover:text-pink-600 transition ${
            variant === 'compact' ? 'text-base line-clamp-2' : 'text-base line-clamp-2 overflow-hidden'
          }`}>
            {perfume.perfumeName}
          </h3>

          <div className="mb-3">
            {rating}
          </div>

          <div className="flex flex-col gap-2 items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">${perfume.price.toFixed(2)}</span>
            {variant === 'default' && perfume.stock > 0 && (
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700 w-full">
                Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
}


