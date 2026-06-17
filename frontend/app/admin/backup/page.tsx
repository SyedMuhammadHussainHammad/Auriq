"use client";

import { Database } from "lucide-react";

export default function BackupPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 border border-gold/20">
        <Database className="w-8 h-8 text-gold" />
      </div>
      <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Backup & Export</h1>
      <p className="text-foreground/60 leading-relaxed">
        Export orders, customers, and product catalogs to CSV. Perform full database snapshots. This module is pending backend integration.
      </p>
    </div>
  );
}
