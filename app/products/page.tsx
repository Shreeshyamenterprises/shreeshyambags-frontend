"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [shape, setShape] = useState("");

  useEffect(() => {
    loadProducts();
  }, [search, size, color, shape]);

  async function loadProducts() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (size) params.set("size", size);
      if (color) params.set("color", color);
      if (shape) params.set("shape", shape);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.items ?? res.data ?? []);
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setSize("");
    setColor("");
    setShape("");
  }

  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Our Collection
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Find the perfect non woven bag for your business
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Browse premium custom bags in different colors, sizes and shapes.
              Designed for shops, brands, gifting and bulk orders.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
            <input
              type="text"
              placeholder="Search bags..."
              className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>

            <select
              className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">All Colors</option>
              <option value="Mint">Mint</option>
              <option value="Grey Shade">Grey Shade</option>
              <option value="White">White</option>
              <option value="Black">Black</option>
              <option value="Pink">Pink</option>
            </select>

            <select
              className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              value={shape}
              onChange={(e) => setShape(e.target.value)}
            >
              <option value="">All Shapes</option>
              <option value="D-Cut">D-Cut</option>
              <option value="W-Cut">W-Cut</option>
              <option value="Loop Handle">Loop Handle</option>
              <option value="Rectangle">Rectangle</option>
            </select>

            <button
              onClick={clearFilters}
              className="rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Clear
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              <span className="font-semibold text-zinc-800">
                {products.length}
              </span>{" "}
              products
            </p>
            <p>Use filters to quickly find the right bag style</p>
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
              <p className="text-sm text-zinc-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
              <h2 className="text-xl font-semibold text-zinc-900">
                No products found
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Try changing your search or filter options.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
