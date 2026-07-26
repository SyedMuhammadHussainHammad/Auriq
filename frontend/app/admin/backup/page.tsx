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
        id: `AUR-${o.id}`,
        date: new Date(o.created_at).toLocaleDateString(),
        status: o.status,
        customer: o.user ? `${o.user.first_name} ${o.user.last_name}` : (o.guest_name || "Guest"),
        email: o.user?.email || o.guest_email || "",
        phone: o.shipping_phone || "",
        city: o.shipping_city || "",
        items: o.items?.length || 0,
        subtotal: o.subtotal,
        shipping: o.shipping_fee,
        discount: o.discount_amount || 0,
        total: o.total,
        payment: o.payment_method,
        notes: o.notes || "",
      }));
      const columns = [
        { key: "id", label: "Order ID" },
        { key: "date", label: "Date" },
        { key: "status", label: "Status" },
        { key: "customer", label: "Customer" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "city", label: "City" },
        { key: "items", label: "Items" },
        { key: "subtotal", label: "Subtotal (Rs)" },
        { key: "shipping", label: "Shipping (Rs)" },
        { key: "discount", label: "Discount (Rs)" },
        { key: "total", label: "Total (Rs)" },
        { key: "payment", label: "Payment" },
        { key: "notes", label: "Notes" },
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

      const rows: any[] = [];

      // Registered customers
      (customersRes.data || []).forEach((c: any) => {
        rows.push({
          type: "Registered",
          name: c.name || "",
          email: c.email || "",
          phone: c.phone || "",
          orders: c.total_orders || 0,
          spent: c.total_spent || 0,
          status: c.is_active ? "Active" : "Inactive",
          joined: new Date(c.created_at).toLocaleDateString(),
        });
      });

      // Guest customers — deduplicate by email, accumulate orders + spent
      const guestMap: Record<string, any> = {};
      (ordersRes.data || []).forEach((o: any) => {
        if (o.user_id) return; // skip registered users
        const email = o.guest_email || "";
        const key = email || `guest_${o.id}`;
        if (!guestMap[key]) {
          guestMap[key] = {
            type: "Guest",
            name: o.guest_name || o.shipping_name || "Guest",
            email,
            phone: o.shipping_phone || o.guest_phone || "",
            orders: 0,
            spent: 0,
            status: "Guest",
            joined: new Date(o.created_at).toLocaleDateString(),
          };
        }
        guestMap[key].orders += 1;
        guestMap[key].spent += Number(o.total || 0);
      });
      rows.push(...Object.values(guestMap));

      const columns = [
        { key: "type", label: "Type" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "orders", label: "Total Orders" },
        { key: "spent", label: "Total Spent (Rs)" },
        { key: "status", label: "Status" },
        { key: "joined", label: "First Order / Joined" },
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
      const rows: any[] = [];
      products.forEach(p => {
        const variants: any[] = p.variants || [];
        if (variants.length === 0) {
          rows.push({
            id: p.id,
            name: p.name,
            brand: p.brand || "",
            category: p.category?.name || "",
            size_ml: "",
            price: "",
            discount_price: "",
            stock: "",
            sku: "",
            status: p.is_active ? "Active" : "Inactive",
          });
        } else {
          variants.forEach(v => {
            rows.push({
              id: p.id,
              name: p.name,
              brand: p.brand || "",
              category: p.category?.name || "",
              size_ml: v.size_ml || "",
              price: v.price || "",
              discount_price: v.discount_price || "",
              stock: v.stock_quantity ?? "",
              sku: v.sku || "",
              status: p.is_active ? "Active" : "Inactive",
            });
          });
        }
      });
      const columns = [
        { key: "id", label: "Product ID" },
        { key: "name", label: "Name" },
        { key: "brand", label: "Brand" },
        { key: "category", label: "Category" },
        { key: "size_ml", label: "Size (ml)" },
        { key: "price", label: "Price (Rs)" },
        { key: "discount_price", label: "Sale Price (Rs)" },
        { key: "stock", label: "Stock" },
        { key: "sku", label: "SKU" },
        { key: "status", label: "Status" },
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
      const res = await adminFetch("/newsletters");
      const subscribers: any[] = res.data || [];
      const rows = subscribers.map(s => ({
        email: s.email || "",
        subscribed: new Date(s.created_at).toLocaleDateString(),
      }));
      const columns = [
        { key: "email", label: "Email" },
        { key: "subscribed", label: "Subscribed On" },
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
