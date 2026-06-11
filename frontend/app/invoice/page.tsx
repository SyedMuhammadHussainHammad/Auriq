"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Printer } from "lucide-react";

export default function InvoicePage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24 pt-32">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="lux-glass-card p-12 text-foreground">
            <div className="flex justify-between items-start mb-12 border-b border-foreground/10 pb-8">
              <div>
                <h1 className="text-3xl font-serif text-gold tracking-widest font-bold uppercase mb-2">AURIQ</h1>
                <p className="text-sm text-foreground/60 tracking-wide">Sindh madrasa tul islamia<br/>Garikhata Karachi, 74000</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold tracking-widest mb-1">INVOICE</h2>
                <p className="text-sm text-foreground/60 tracking-wide">Order #AUR-{Math.floor(Math.random() * 100000)}<br/>June 10, 2026</p>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-bold tracking-widest text-gold uppercase mb-2">Billed To</h3>
              <p className="text-sm text-foreground/80 tracking-wide">Guest Customer<br/>guest@example.com</p>
            </div>

            <div className="w-full mb-12">
              <div className="grid grid-cols-4 border-b border-foreground/20 pb-4 mb-4 text-xs font-bold tracking-widest uppercase text-foreground/60">
                <div className="col-span-2">Item</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Amount</div>
              </div>
              <div className="grid grid-cols-4 mb-4 text-sm font-medium tracking-wide">
                <div className="col-span-2">Royal Oud (50ml)</div>
                <div className="text-center">1</div>
                <div className="text-right">Rs. 15,000</div>
              </div>
              <div className="grid grid-cols-4 border-t border-foreground/10 pt-4 text-sm font-medium tracking-wide">
                <div className="col-span-3 text-right text-foreground/60">Subtotal:</div>
                <div className="text-right">Rs. 15,000</div>
              </div>
              <div className="grid grid-cols-4 mt-2 text-sm font-medium tracking-wide">
                <div className="col-span-3 text-right text-foreground/60">Shipping:</div>
                <div className="text-right text-gold">Free</div>
              </div>
              <div className="grid grid-cols-4 mt-4 text-lg font-bold tracking-widest border-t border-foreground/20 pt-4">
                <div className="col-span-3 text-right text-gold">Total:</div>
                <div className="text-right">Rs. 15,000</div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-transparent border border-foreground/20 text-foreground py-3 px-8 text-xs font-bold tracking-widest hover:border-gold hover:text-gold transition-colors uppercase">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
