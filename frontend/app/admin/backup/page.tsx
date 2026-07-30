"use client";

import { useState } from "react";
import { Database, Download, ShoppingCart, Users, Package, Mail, CheckCircle, Loader2 } from "lucide-react";
import { adminFetch } from "../lib/adminFetch";

type ExportStatus = "idle" | "loading" | "done" | "error";

const toCSV = (rows: Record<string, any>[], columns: { key: string; label: string }[]): string => {
  const header = columns.map(c => `"${c.label}"`).join(",");
  const body = rows.map(row =>
    columns.map(c => {
      const val = row[c.key] ?? "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",")
  );
  return [header, ...body].join("\n");
};

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function BackupPage() {
  const [statuses, setStatuses] = useState<Record<string, ExportStatus>>({
    orders: "idle",
    customers: "idle",
    products: "idle",
    newsletter: "idle",
  });

  const setStatus = (key: string, status: ExportStatus) =>
    setStatuses(prev => ({ ...prev, [key]: status }));

  const exportOrders = async () => {
    setStatus("orders", "loading");
    try {
      const res = await adminFetch("/orders");
      const orders: any[] = res.data || [];
      const rows = orders.map(o => ({
        order_id: `AUR-${o.id}`,
        customer_name: o.user
          ? (o.user.name || "")
          : (o.guest_name || o.shipping_name || "Guest"),
        products: (o.items || [])
          .map((i: any) => `${i.item_name} x${i.quantity}`)
          .join("; "),
        address: [o.shipping_street, o.shipping_city, o.shipping_province]
          .filter(Boolean).join(", "),
        phone: o.shipping_phone || "",
        amount: `Rs. ${Number(o.total).toLocaleString()}`,
      }));
      const columns = [
        { key: "order_id", label: "Order ID" },
        { key: "customer_name", label: "Customer Name" },
        { key: "products", label: "Products" },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone" },
        { key: "amount", label: "Amount" },
      ];
      downloadCSV(toCSV(rows, columns), `auriq-orders-${Date.now()}.csv`);
      setStatus("orders", "done");
      setTimeout(() => setStatus("orders", "idle"), 3000);
    } catch {
      setStatus("orders", "error");
      setTimeout(() => setStatus("orders", "idle"), 3000);
    }
  };

  const exportCustomers = async () => {
    setStatus("customers", "loading");
    try {
      const [customersRes, ordersRes] = await Promise.all([
        adminFetch("/customers?limit=10000"),
        adminFetch("/orders"),
      ]);

      const orders: any[] = ordersRes.data || [];

      // Build map of most recent shipping address per registered user_id
      const userAddressMap: Record<number, string> = {};
      orders.forEach((o: any) => {
        if (o.user_id && !userAddressMap[o.user_id]) {
          userAddressMap[o.user_id] = [o.shipping_street, o.shipping_city, o.shipping_province]
            .filter(Boolean).join(", ");
        }
      });

      const rows: any[] = [];

      // Registered customers
      (customersRes.data || []).forEach((c: any) => {
        rows.push({
          customer_id: c.id,
          name: c.name || "",
          email: c.email || "",
          address: userAddressMap[c.id] || "",
          phone: c.phone || "",
        });
      });

      // Guest customers — deduplicate by email, use first order's address
      const guestMap: Record<string, any> = {};
      orders.forEach((o: any) => {
        if (o.user_id) return;
        const email = o.guest_email || "";
        const key = email || `guest_${o.id}`;
        if (!guestMap[key]) {
          guestMap[key] = {
            customer_id: "Guest",
            name: o.guest_name || o.shipping_name || "Guest",
            email,
            address: [o.shipping_street, o.shipping_city, o.shipping_province]
              .filter(Boolean).join(", "),
            phone: o.shipping_phone || o.guest_phone || "",
          };
        }
      });
      rows.push(...Object.values(guestMap));

      const columns = [
        { key: "customer_id", label: "Customer ID" },
        { key: "name", label: "Customer Name" },
        { key: "email", label: "Email" },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone" },
      ];
      downloadCSV(toCSV(rows, columns), `auriq-customers-${Date.now()}.csv`);
      setStatus("customers", "done");
      setTimeout(() => setStatus("customers", "idle"), 3000);
    } catch {
      setStatus("customers", "error");
      setTimeout(() => setStatus("customers", "idle"), 3000);
    }
  };

  const exportProducts = async () => {
    setStatus("products", "loading");
    try {
      const res = await adminFetch("/products");
      const products: any[] = res.data || [];
      const rows = products.map(p => {
        const variants: any[] = p.variants || [];
        const prices = variants.map(v => Number(v.discount_price || v.price || 0)).filter(n => n > 0);
        const price = prices.length > 0 ? Math.min(...prices) : 0;
        return {
          product_id: p.id,
          product_name: p.name,
          price: price > 0 ? `Rs. ${price.toLocaleString()}` : "",
        };
      });
      const columns = [
        { key: "product_id", label: "Product ID" },
        { key: "product_name", label: "Product Name" },
        { key: "price", label: "Price" },
      ];
      downloadCSV(toCSV(rows, columns), `auriq-products-${Date.now()}.csv`);
      setStatus("products", "done");
      setTimeout(() => setStatus("products", "idle"), 3000);
    } catch {
      setStatus("products", "error");
      setTimeout(() => setStatus("products", "idle"), 3000);
    }
  };

  const exportNewsletter = async () => {
    setStatus("newsletter", "loading");
    try {
      const [newsletterRes, customersRes] = await Promise.all([
        adminFetch("/newsletters?limit=10000"),
        adminFetch("/customers?limit=10000"),
      ]);
      // Build email → {name, id} map from registered customers
      const customerByEmail: Record<string, { id: number; name: string }> = {};
      (customersRes.data || []).forEach((c: any) => {
        if (c.email) customerByEmail[c.email.toLowerCase()] = { id: c.id, name: c.name || "" };
      });

      const rows = (newsletterRes.data || []).map((s: any) => {
        const match = customerByEmail[s.email?.toLowerCase()] || null;
        return {
          email: s.email || "",
          name: match?.name || "",
          customer_id: match?.id ?? "",
        };
      });
      const columns = [
        { key: "email", label: "Email" },
        { key: "name", label: "Name" },
        { key: "customer_id", label: "Customer ID" },
      ];
      downloadCSV(toCSV(rows, columns), `auriq-newsletter-${Date.now()}.csv`);
      setStatus("newsletter", "done");
      setTimeout(() => setStatus("newsletter", "idle"), 3000);
    } catch {
      setStatus("newsletter", "error");
      setTimeout(() => setStatus("newsletter", "idle"), 3000);
    }
  };

  const exports = [
    {
      key: "orders",
      label: "Orders",
      description: "All orders with customer info, items, totals, and status",
      icon: ShoppingCart,
      action: exportOrders,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      key: "customers",
      label: "Customers",
      description: "Registered customers with contact info and order history",
      icon: Users,
      action: exportCustomers,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      key: "products",
      label: "Products",
      description: "Full product catalog with variants, pricing, and stock levels",
      icon: Package,
      action: exportProducts,
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      key: "newsletter",
      label: "Newsletter Subscribers",
      description: "All email subscribers with subscription dates",
      icon: Mail,
      action: exportNewsletter,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Backup & Export</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">Download your store data as CSV files. Opens directly in Excel or Google Sheets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exports.map(({ key, label, description, icon: Icon, action, color, bg }) => {
          const status = statuses[key];
          return (
            <div key={key} className="bg-background rounded-xl border border-foreground/10 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground tracking-wide mb-1">{label}</h2>
                  <p className="text-xs text-foreground/50 font-medium leading-relaxed">{description}</p>
                </div>
              </div>
              <button
                onClick={action}
                disabled={status === "loading"}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all
                  ${status === "done" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                    status === "error" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                    "bg-foreground/5 text-foreground hover:bg-gold/10 hover:text-gold border border-foreground/10 hover:border-gold/30 disabled:opacity-50"}`}
              >
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
                ) : status === "done" ? (
                  <><CheckCircle className="w-4 h-4" /> Downloaded</>
                ) : status === "error" ? (
                  "Export Failed — Try Again"
                ) : (
                  <><Download className="w-4 h-4" /> Export CSV</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 p-5 flex items-start gap-3">
        <Database className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-foreground/50 font-medium leading-relaxed">
          Exports include all records at the time of download. For database-level backups, use the Supabase dashboard under <span className="text-foreground/70">Project → Backups</span>.
        </p>
      </div>
    </div>
  );
}
