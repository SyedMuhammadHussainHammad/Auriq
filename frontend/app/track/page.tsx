"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Mail, Search, ChevronRight } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { API_URL } from "../utils/api";

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  SHIPPED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    const raw = orderId.trim().replace(/^AUR-/i, "");
    const id = parseInt(raw, 10);

    if (isNaN(id)) {
      setError("Please enter a valid order ID (e.g. AUR-1234).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/orders/track?id=${id}&email=${encodeURIComponent(email.trim())}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "No order found with that ID and email combination.");
      } else {
        setOrder(data.data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusClass = order
    ? STATUS_STYLES[order.status] || "bg-gold/10 text-gold border-gold/20"
    : "";

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0" />

        <div className="relative z-10 container-lux pt-20 md:pt-28 max-w-2xl">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-12 font-bold">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Track Order</span>
          </div>

          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-widest mb-4">Track Your Order</h1>
            <p className="text-foreground/60 text-sm font-medium tracking-wide">Enter your order ID and the email you used at checkout.</p>
          </div>

          <div className="lux-glass-card p-8">
            <form onSubmit={handleTrack} className="flex flex-col gap-6">
              {error && (
                <div className="text-red-400 text-sm font-medium bg-red-500/5 border border-red-500/20 p-4">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold group-focus-within:text-gold transition-colors">
                  Order ID
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-gold transition-colors" />
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. AUR-1234"
                    required
                    className="w-full bg-transparent border-b border-foreground/20 py-3 !pl-12 pr-4 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 font-bold group-focus-within:text-gold transition-colors">
                  Email Used at Checkout
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-gold transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-transparent border-b border-foreground/20 py-3 !pl-12 pr-4 text-sm focus:outline-none focus:border-gold transition-colors text-foreground font-medium tracking-wide"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-background py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </form>
          </div>

          {/* Result */}
          {order && (
            <div className="mt-8 lux-glass-card overflow-hidden">
              <div className="bg-foreground/5 p-6 border-b border-foreground/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-foreground/50 font-bold uppercase tracking-widest mb-1">Order Number</p>
                  <p className="text-lg font-bold text-foreground tracking-wide">AUR-{order.id}</p>
                  <p className="text-xs text-foreground/50 mt-1">Placed {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`self-start sm:self-center px-4 py-2 border text-[10px] font-bold uppercase tracking-widest ${statusClass}`}>
                  {order.status}
                </span>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/50">Items Ordered</p>
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-sm text-foreground/80">
                    <span className="font-medium">{item.item_name}</span>
                    <span className="text-foreground/50">× {item.quantity}</span>
                  </div>
                ))}

                <div className="border-t border-foreground/10 pt-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-foreground/60">
                    <span>Subtotal</span>
                    <span>Rs. {Number(order.subtotal).toLocaleString()}</span>
                  </div>
                  {Number(order.shipping_fee) > 0 && (
                    <div className="flex justify-between text-foreground/60">
                      <span>Shipping</span>
                      <span>Rs. {Number(order.shipping_fee).toLocaleString()}</span>
                    </div>
                  )}
                  {Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount{order.discount_code ? ` (${order.discount_code})` : ""}</span>
                      <span>-Rs. {Number(order.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-foreground border-t border-foreground/10 pt-2 mt-1">
                    <span>Total</span>
                    <span>Rs. {Number(order.total).toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href={`/invoice/${order.id}`}
                  className="mt-2 text-center w-full border border-foreground/20 text-foreground py-3 text-xs font-bold tracking-widest uppercase hover:border-gold hover:text-gold transition-colors block"
                >
                  View Full Invoice
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
