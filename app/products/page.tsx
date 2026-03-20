"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, X, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types";
import { toast } from "sonner";

const SIZE_OPTIONS  = ["Small", "Medium", "Large", "Extra Large"];
const COLOR_OPTIONS = ["Mint", "Grey Shade", "White", "Black", "Pink", "Blue", "Red"];
const SHAPE_OPTIONS = ["D-Cut", "W-Cut", "Loop Handle", "Rectangle"];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition duration-200 ${
        active
          ? "border-pink-500 bg-pink-500 text-white shadow-sm"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
      <div className="aspect-[4/3.5] animate-pulse bg-zinc-100" />
      <div className="space-y-3 p-5">
        <div className="flex gap-2">
          <div className="h-5 w-14 animate-pulse rounded-full bg-zinc-100" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-100" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-zinc-100" />
        <div className="flex items-center justify-between border-t border-zinc-50 pt-4">
          <div className="h-7 w-20 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-9 w-24 animate-pulse rounded-xl bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [size, setSize]               = useState("");
  const [color, setColor]             = useState("");
  const [shape, setShape]             = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Debounce search so API is called 400ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => { loadProducts(); }, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search, size, color, shape]);

  async function loadProducts() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (size)   params.set("size", size);
      if (color)  params.set("color", color);
      if (shape)  params.set("shape", shape);
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.items ?? res.data ?? []);
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSearch(""); setSize(""); setColor(""); setShape("");
  }

  const hasFilters = useMemo(() => Boolean(search || size || color || shape), [search, size, color, shape]);

  const activeCount = [size, color, shape].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[320px] flex-col justify-center overflow-hidden border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        {/* Background image */}
        <div className="absolute inset-0 opacity-[0.07]">
          <Image src="/banner-bags.png" alt="" fill className="object-cover" priority />
        </div>

        {/* Ambient blobs */}
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-16">
          {/* Left: text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-500">
              Our Collection
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              Premium Non-Woven Bags
            </h1>
            <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
              Custom bags in different colors, sizes and shapes — designed for shops, brands and bulk orders with strong per-kg pricing.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { label: "MOQ", value: "200 KG" },
                { label: "Pricing", value: "Per KG" },
                { label: "Custom", value: "Logo Printing" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                  <span className="text-zinc-400">{label}: </span>{value}
                </div>
              ))}
            </div>
          </div>

          {/* Right: product spec cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "50+",      label: "Bag Variants" },
              { value: "200 KG",   label: "Min. Order Qty" },
              { value: "7 Colors", label: "Available Colors" },
              { value: "4 Shapes", label: "Bag Styles" },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-2xl bg-white/80 px-5 py-4 shadow-sm ring-1 ring-zinc-200/60 backdrop-blur-sm">
                <p className="text-2xl font-bold text-zinc-900">{value}</p>
                <p className="mt-0.5 text-xs font-medium text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Search + Filter bar ── */}
        <div className="sticky top-[73px] z-30 -mx-4 bg-[#f7f7fb]/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

          {/* Main bar */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
            <div className="flex items-center divide-x divide-zinc-100">

              {/* Search input */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bags, styles, colors…"
                  className="w-full bg-transparent py-4 pl-11 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter toggle button */}
              <button
                onClick={() => setFiltersOpen(p => !p)}
                className={`flex shrink-0 items-center gap-2 px-5 py-4 text-sm font-semibold transition ${
                  filtersOpen || activeCount > 0
                    ? "bg-pink-500 text-white"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-pink-600">
                    {activeCount}
                  </span>
                )}
              </button>

              {/* Product count */}
              <div className="hidden shrink-0 items-center gap-1.5 px-5 py-4 sm:flex">
                <span className="text-lg font-bold text-zinc-900">{products.length}</span>
                <span className="text-sm text-zinc-400">products</span>
              </div>
            </div>

            {/* Expanded filter panel — inside the card */}
            {filtersOpen && (
              <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-5">
                <div className="grid gap-5 sm:grid-cols-3">
                  {/* Size */}
                  <div>
                    <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <span className="h-px flex-1 bg-zinc-200" /> Size <span className="h-px flex-1 bg-zinc-200" />
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SIZE_OPTIONS.map(o => (
                        <FilterChip key={o} label={o} active={size === o} onClick={() => setSize(size === o ? "" : o)} />
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <span className="h-px flex-1 bg-zinc-200" /> Color <span className="h-px flex-1 bg-zinc-200" />
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_OPTIONS.map(o => (
                        <FilterChip key={o} label={o} active={color === o} onClick={() => setColor(color === o ? "" : o)} />
                      ))}
                    </div>
                  </div>

                  {/* Shape */}
                  <div>
                    <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <span className="h-px flex-1 bg-zinc-200" /> Shape <span className="h-px flex-1 bg-zinc-200" />
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SHAPE_OPTIONS.map(o => (
                        <FilterChip key={o} label={o} active={shape === o} onClick={() => setShape(shape === o ? "" : o)} />
                      ))}
                    </div>
                  </div>
                </div>

                {hasFilters && (
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                    <p className="text-xs text-zinc-400">{activeCount} filter{activeCount !== 1 ? "s" : ""} active</p>
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-pink-600 transition hover:bg-pink-50"
                    >
                      <X className="h-3.5 w-3.5" /> Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active filter pills (shown when filter panel is closed) */}
          {hasFilters && !filtersOpen && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-400">Active:</span>
              {search && (
                <span className="flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 ring-1 ring-pink-100">
                  &ldquo;{search}&rdquo;
                  <button onClick={() => setSearch("")} className="rounded-full hover:bg-pink-100"><X className="h-3 w-3" /></button>
                </span>
              )}
              {size && (
                <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 ring-1 ring-blue-100">
                  Size: {size} <button onClick={() => setSize("")} className="rounded-full hover:bg-blue-100"><X className="h-3 w-3" /></button>
                </span>
              )}
              {color && (
                <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 ring-1 ring-purple-100">
                  Color: {color} <button onClick={() => setColor("")} className="rounded-full hover:bg-purple-100"><X className="h-3 w-3" /></button>
                </span>
              )}
              {shape && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-100">
                  Shape: {shape} <button onClick={() => setShape("")} className="rounded-full hover:bg-emerald-100"><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Product grid ── */}
        <div className="pb-16 pt-2">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1,2,3,4,5,6].map(i => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white py-20 text-center shadow-sm ring-1 ring-zinc-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50">
                <ShoppingBag className="h-8 w-8 text-zinc-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">No products found</h2>
                <p className="mt-2 text-sm text-zinc-500">Try changing your search or filters to find the right bag.</p>
              </div>
              <button
                onClick={clearFilters}
                className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">
                    {hasFilters ? "Filtered Results" : "All Products"}
                  </h2>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {products.length} product{products.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
