import { Metadata } from "next";
import { Suspense } from "react";
import { API_URL } from "../utils/api";
import CollectionsClient from "./CollectionsClient";

export const metadata: Metadata = {
  title: "The Collection | Auriq Fragrances",
  description: "Explore our complete portfolio of luxury fragrances. Each scent is a masterpiece, crafted with the finest ingredients to evoke profound emotions.",
};

export default async function CollectionsPage({ searchParams }: { searchParams: { category?: string; sort?: string; search?: string } }) {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/products?limit=500`, { next: { tags: ['products'] } }),
      fetch(`${API_URL}/categories`, { next: { tags: ['categories'], revalidate: 3600 } as any }),
    ]);
    if (productsRes.ok) {
      const data = await productsRes.json();
      products = data.data || [];
    }
    if (categoriesRes.ok) {
      const data = await categoriesRes.json();
      categories = data.data || [];
    }
  } catch (err) {
    console.warn("Failed to fetch collections", err instanceof Error ? err.message : String(err));
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-perfume-main flex items-center justify-center text-gold">Loading Collection...</div>}>
      <CollectionsClient
        initialProducts={products}
        categories={categories}
        initialCategory={searchParams.category || ""}
      />
    </Suspense>
  );
}
