"use client";

import { useEffect, useState } from "react";
import { adminReviewService } from "../services/adminReviewService";
import { CheckCircle2, XCircle, Star } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = () => {
    setIsLoading(true);
    adminReviewService.getReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await adminReviewService.updateReviewStatus(id, !currentStatus);
      setReviews(reviews.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r));
    } catch (error) {
      console.error(error);
      alert("Failed to update review status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Customer Reviews</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">Manage and moderate product reviews left by customers.</p>
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Rating</th>
                <th className="p-4 font-bold">Review</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className={`border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm ${!review.is_active ? 'bg-red-500/5' : ''}`}>
                  <td className="p-4 font-bold text-foreground">{review.product.name}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground/80">{review.user.name}</span>
                      <span className="text-xs text-foreground/50">{review.user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold' : 'fill-transparent text-foreground/20'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-xs truncate text-foreground/70" title={review.comment || "No comment"}>
                    {review.comment || <span className="italic text-foreground/40">No comment</span>}
                  </td>
                  <td className="p-4 text-foreground/60 text-xs">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${review.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {review.is_active ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleToggleStatus(review.id, review.is_active)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${review.is_active ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                    >
                      {review.is_active ? 'Hide' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reviews.length === 0 && (
          <div className="p-8 text-center text-foreground/50 text-sm font-medium">
            No reviews found.
          </div>
        )}
      </div>
    </div>
  );
}
