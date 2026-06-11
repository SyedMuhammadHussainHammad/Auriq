"use client";

import { Heart, ShoppingBag } from "lucide-react";

export default function ProductCardActions({ productId }: { productId: number }) {
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Implement Wishlist API
    console.log("Add to wishlist", productId);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Implement Cart API
    console.log("Add to cart", productId);
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10">
        <button onClick={handleWishlist} className="bg-background/60 backdrop-blur-md border border-foreground/20 text-foreground p-3 rounded-full hover:bg-gold hover:text-background hover:border-gold transition-all shadow-lg" aria-label="Add to Wishlist">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
        <button onClick={handleAddToCart} className="w-full bg-gold/90 backdrop-blur-md text-background py-4 text-sm font-bold tracking-widest hover:bg-foreground transition-colors flex items-center justify-center gap-2 border-t border-foreground/20">
          <ShoppingBag className="w-5 h-5" />
          ADD TO CART
        </button>
      </div>
    </>
  );
}
