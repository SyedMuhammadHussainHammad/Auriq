"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Loader2, Package, Megaphone, ExternalLink, Copy, CheckCircle } from "lucide-react";
import Image from "next/image";
import { adminFetch } from "../lib/adminFetch";

interface MediaItem {
  url: string;
  label: string;
  source: "product" | "ad";
  sourceId: number;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "product" | "ad">("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, adsRes] = await Promise.all([
          adminFetch("/products"),
          adminFetch("/ads"),
        ]);

        const productImages: MediaItem[] = [];
        (productsRes.data || []).forEach((product: any) => {
          (product.images || []).forEach((img: any) => {
            if (img.image_url) {
              productImages.push({
                url: img.image_url,
                label: product.name,
                source: "product",
                sourceId: product.id,
              });
            }
          });
        });

        const adImages: MediaItem[] = [];
        (adsRes.data || []).forEach((ad: any) => {
          if (ad.image_url) {
            adImages.push({
              url: ad.image_url,
              label: ad.title || "Banner",
              source: "ad",
              sourceId: ad.id,
            });
          }
          if (ad.mobile_image_url) {
            adImages.push({
              url: ad.mobile_image_url,
              label: `${ad.title || "Banner"} (Mobile)`,
              source: "ad",
              sourceId: ad.id,
            });
          }
        });

        setItems([...productImages, ...adImages]);
      } catch {
        // silently fail — items stay empty
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const filtered = filter === "all" ? items : items.filter(i => i.source === filter);
  const productCount = items.filter(i => i.source === "product").length;
  const adCount = items.filter(i => i.source === "ad").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Media Library</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">All images used across your products and banners.</p>
      </div>

      {/* Stats + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { key: "all", label: `All (${items.length})` },
          { key: "product", label: `Products (${productCount})` },
          { key: "ad", label: `Banners (${adCount})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border transition-all ${
              filter === f.key
                ? "bg-gold/10 text-gold border-gold/30"
                : "bg-background text-foreground/50 border-foreground/10 hover:border-gold/30 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-foreground/50 py-12 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading media...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-foreground/5 rounded-2xl flex items-center justify-center mb-4">
            <ImageIcon className="w-6 h-6 text-foreground/30" />
          </div>
          <p className="text-sm text-foreground/50 font-medium">No images found.</p>
          <p className="text-xs text-foreground/30 mt-1">Images will appear here once products or banners are added.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item, idx) => (
            <div key={idx} className="group relative bg-background rounded-xl border border-foreground/10 overflow-hidden hover:border-gold/30 transition-all shadow-sm">
              <div className="relative aspect-square bg-foreground/5">
                <Image
                  src={item.url}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopy(item.url)}
                    title="Copy URL"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    {copiedUrl === item.url
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <Copy className="w-4 h-4 text-white" />}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in new tab"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>

              {/* Label */}
              <div className="px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  {item.source === "product"
                    ? <Package className="w-3 h-3 text-foreground/30 flex-shrink-0" />
                    : <Megaphone className="w-3 h-3 text-foreground/30 flex-shrink-0" />}
                  <span className="text-[9px] uppercase tracking-widest font-bold text-foreground/30">
                    {item.source === "product" ? "Product" : "Banner"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground truncate">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
