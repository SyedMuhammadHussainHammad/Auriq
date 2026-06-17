"use client";

import { Award } from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 border border-gold/20">
        <Award className="w-8 h-8 text-gold" />
      </div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Loyalty & Rewards</h1>
      <p className="text-foreground/60 leading-relaxed">
        Manage customer points, set up referral programs, and configure VIP customer tiers. This module is pending backend integration.
      </p>
    </div>
  );
}
