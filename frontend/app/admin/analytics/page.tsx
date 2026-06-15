"use client";

import { useEffect, useState } from "react";
import { adminAnalyticsService } from "../services/adminAnalyticsService";
import { TrendingUp, DollarSign, Users, Target, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAnalyticsService.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return <div>Failed to load analytics</div>;

  const stats = [
    { title: "Revenue Today", value: `Rs. ${Number(data.revenueToday).toLocaleString()}`, icon: DollarSign },
    { title: "Revenue This Week", value: `Rs. ${Number(data.revenueWeek).toLocaleString()}`, icon: Activity },
    { title: "Revenue This Month", value: `Rs. ${Number(data.revenueMonth).toLocaleString()}`, icon: TrendingUp },
    { title: "Revenue This Year", value: `Rs. ${Number(data.revenueYear).toLocaleString()}`, icon: Target },
    { title: "Average Order Value", value: `Rs. ${Number(data.averageOrderValue).toLocaleString()}`, icon: DollarSign },
    { title: "Returning Customers", value: data.returningCustomers, icon: Users },
  ];

  // Calculate percentages for simple horizontal bar charts
  const maxRevenue = Math.max(
    ...data.topProducts.map((p: any) => Number(p.revenue)), 1
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Analytics & Reports</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">Detailed insights into your business performance.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-background rounded-xl p-6 border border-foreground/10 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] uppercase tracking-widest text-foreground/60 font-bold">{stat.title}</span>
              <div className="w-8 h-8 rounded bg-gold/10 flex items-center justify-center text-gold">
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="z-10">
              <span className="text-3xl font-bold text-foreground tracking-wide">{stat.value}</span>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <stat.icon className="w-32 h-32 text-foreground" />
            </div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden mt-4">
        <div className="p-6 border-b border-foreground/10">
          <h2 className="text-lg font-serif font-bold text-foreground tracking-wide">Top Selling Products</h2>
        </div>
        <div className="p-6 flex flex-col gap-6">
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-foreground/60">No sales data available yet.</p>
          ) : (
            data.topProducts.map((product: any, idx: number) => {
              const width = `${(Number(product.revenue) / maxRevenue) * 100}%`;
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-foreground">{product.name} <span className="text-foreground/50 font-medium">({product.size}ml)</span></span>
                    <div className="text-right flex flex-col">
                      <span className="font-bold text-foreground">Rs. {Number(product.revenue).toLocaleString()}</span>
                      <span className="text-[10px] uppercase tracking-widest text-foreground/50">{product.sold} sold</span>
                    </div>
                  </div>
                  <div className="w-full bg-foreground/5 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-gold/50 to-gold h-full rounded-full" style={{ width }}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
