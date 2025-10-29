import { useState, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Star } from 'lucide-react';
import { useToast } from './ui/use-toast';
import type { Comment } from '../api/mockData';

interface CommentSectionProps {
  perfumeId: string;
  comments: Comment[];
  onAddComment?: (rating: number, content: string) => void;
}

export default function CommentSection({ perfumeId, comments, onAddComment }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  const hasCommented = useMemo(() => {
    if (!user) return false;
    return comments.some((c: any) => {
      const author = c.author || {};
      return (
        author.id === user.id ||
        author._id === user.id ||
        author.email === user.email ||
        author.name === user.name
      );
    });
  }, [comments, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (hasCommented) {
      toast({ title: 'Bạn chỉ được comment 1 lần', description: 'Bạn đã gửi đánh giá cho sản phẩm này.' });
      return;
    }

    if (content.trim().length < 10) {
      toast({ title: 'Nội dung quá ngắn', description: 'Vui lòng nhập ít nhất 10 ký tự.' });
      return;
    }

    onAddComment?.(rating, content);
    setContent('');
    setRating(5);
  };

  const renderStars = (score: number, interactive = false, size: 'sm' | 'md' = 'md') => {
    const sizeCls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              className={`${sizeCls} ${
                star <= (interactive ? (hoveredStar || rating) : score)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Summary/histogram data
  const { average, counts, total, recommendPercent } = useMemo(() => {
    const total = comments.length;
    const counts = [0, 0, 0, 0, 0]; // index 0 -> 1 star
    for (const c of comments) counts[c.rating - 1] += 1;
    const average = total ? comments.reduce((s, c) => s + c.rating, 0) / total : 0;
    const recommendPercent = total ? Math.round(((counts[4] + counts[3]) / total) * 100) : 0; // 4-5 stars
    return { average, counts, total, recommendPercent };
  }, [comments]);

  const visibleComments = useMemo(() => comments.slice(0, visibleCount), [comments, visibleCount]);

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Histogram */}
          <div className="md:col-span-2">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const index = star - 1;
                const value = counts[index];
                const pct = total ? Math.round((value / total) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-10 text-sm text-gray-600">{star} stars</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-3 rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-right text-sm text-gray-600">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Average */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
              {renderStars(Math.round(average), false, 'sm')}
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">{average.toFixed(1)} out of 5</div>
            <div className="text-sm text-gray-600 mb-3">{recommendPercent}% of reviewers recommend this product</div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600">{total} reviews</span>
              <a href="#add-review" className="text-pink-600 hover:text-pink-700">+ Add a Review</a>
            </div>
          </div>
        </div>
      </div>

      {/* Add Review */}
      <div id="add-review">
        {isAuthenticated ? (
          <Card className="mb-2">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Rating</label>
                  {renderStars(rating, true)}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your experience with this perfume..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" disabled={hasCommented}>Submit Review</Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-2">
            <CardContent className="pt-6">
              <p className="text-gray-600">
                Please <a href="/login" className="text-pink-600 hover:underline">sign in</a> to leave a review.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center">No reviews yet. Be the first to review this perfume!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {visibleComments.map((comment) => (
              <Card key={comment._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-pink-600 text-white">
                        {comment.author?.name ? comment.author.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{comment.author.name}</div>
                          <div className="text-sm text-gray-500">{formatDate(comment.createdAt)}</div>
                        </div>
                        {renderStars(comment.rating, false, 'sm')}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {visibleCount < comments.length && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" onClick={() => setVisibleCount((v) => v + 3)} className="px-6">
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
