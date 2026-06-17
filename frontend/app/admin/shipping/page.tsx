"use client";

import { Truck } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 border border-gold/20">
        <Truck className="w-8 h-8 text-gold" />
      </div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Logistics & Shipping</h1>
      <p className="text-foreground/60 leading-relaxed">
        Configure shipping rates, delivery zones, free shipping thresholds, and courier integrations. This module is pending backend integration.
      </p>
    </div>
  );
}
