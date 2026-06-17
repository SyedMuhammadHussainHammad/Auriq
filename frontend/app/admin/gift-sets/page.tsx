"use client";

import { Gift } from "lucide-react";

export default function GiftSetsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 border border-gold/20">
        <Gift className="w-8 h-8 text-gold" />
      </div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Gift Sets</h1>
      <p className="text-foreground/60 leading-relaxed">
        Create exclusive perfume bundles, manage custom packaging options, and view personalized gift notes. This module is pending backend integration.
      </p>
    </div>
  );
}
