"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Search, SlidersHorizontal, X, ShoppingBag,
  ChevronDown, Layers, Palette, Shapes,
} from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types";
import { toast } from "sonner";

// ── filter options (match seeded data) ────────────────────────────────────────
const SHAPE_OPTIONS = ["D-Cut", "W-Cut", "Loop Handle", "Box Bag"];
const COLOR_OPTIONS = [
  "White", "Black", "Blue", "Navy", "Red", "Green", "Pink",
  "Gold", "Silver", "Brown", "Beige", "Saffron", "Purple", "Orange",
];
const GSM_OPTIONS   = ["40", "50", "55", "60", "65", "70", "80", "90", "100", "120"];

const SORT_OPTIONS = [
  { label: "Default",       value: "" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Name: A → Z",   value: "name_asc" },
];

// ── sub-components ─────────────────────────────────────────────────────────────

function FilterSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-zinc-100 py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

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
      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition duration-150 ${
        active
          ? "border-pink-500 bg-pink-500 text-white shadow-sm"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-pink-300 hover:text-pink-600"
      }`}
    >
      {label}
    </button>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-zinc-100">
      <div className="aspect-[4/3] animate-pulse bg-zinc-100" />
      <div className="space-y-3 p-5">
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-4 animate-pulse rounded-full bg-zinc-100" />
          ))}
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-zinc-100" />
        <div className="flex items-center justify-between border-t border-zinc-50 pt-3.5">
          <div className="h-6 w-16 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [color, setColor]       = useState("");
  const [shape, setShape]       = useState("");
  const [gsm, setGsm]           = useState("");
  const [sort, setSort]         = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const mobileFilterRef = useRef<HTMLDivElement>(null);

  // close mobile filters on outside click
  useEffect(() => {
    if (!mobileFiltersOpen) return;
    function handler(e: MouseEvent) {
      if (mobileFilterRef.current && !mobileFilterRef.current.contains(e.target as Node)) {
        setMobileFiltersOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileFiltersOpen]);

  // debounced load
  useEffect(() => {
    const timer = setTimeout(loadProducts, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search, color, shape, gsm, sort]);

  async function loadProducts() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (color)  params.set("color", color);
      if (shape)  params.set("shape", shape);
      const res = await api.get(`/products?${params.toString()}`);
      let items: Product[] = res.data.items ?? res.data ?? [];

      // client-side gsm filter (API may not support it)
      if (gsm) {
        items = items.filter((p) =>
          (p.variants ?? []).some((v) => String(v.gsm) === gsm),
        );
      }

      // client-side sort
      if (sort === "price_asc")  items = [...items].sort((a, b) => (a.basePrice ?? 0) - (b.basePrice ?? 0));
      if (sort === "price_desc") items = [...items].sort((a, b) => (b.basePrice ?? 0) - (a.basePrice ?? 0));
      if (sort === "name_asc")   items = [...items].sort((a, b) => a.title.localeCompare(b.title));

      setProducts(items);
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSearch(""); setColor(""); setShape(""); setGsm(""); setSort("");
  }

  const activeCount = [color, shape, gsm].filter(Boolean).length;
  const hasFilters  = Boolean(search || color || shape || gsm);

  // ── sidebar filter panel (shared between desktop & mobile) ──────────────────
  const FilterPanel = (
    <div className="space-y-0">
      <FilterSection title="Shape" icon={Shapes}>
        <div className="flex flex-wrap gap-1.5">
          {SHAPE_OPTIONS.map((o) => (
            <FilterChip key={o} label={o} active={shape === o} onClick={() => setShape(shape === o ? "" : o)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Color" icon={Palette}>
        <div className="flex flex-wrap gap-1.5">
          {COLOR_OPTIONS.map((o) => (
            <FilterChip key={o} label={o} active={color === o} onClick={() => setColor(color === o ? "" : o)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="GSM" icon={Layers}>
        <div className="flex flex-wrap gap-1.5">
          {GSM_OPTIONS.map((o) => (
            <FilterChip key={o} label={`${o} GSM`} active={gsm === o} onClick={() => setGsm(gsm === o ? "" : o)} />
          ))}
        </div>
      </FilterSection>

      {hasFilters && (
        <div className="pt-4">
          <button
            onClick={clearFilters}
            className="flex w-full items-center justify-center gap-1.5 rounded-full border border-zinc-200 py-2.5 text-xs font-semibold text-zinc-600 transition hover:border-pink-300 hover:text-pink-600"
          >
            <X className="h-3.5 w-3.5" /> Clear all filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f7f7fb]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-zinc-200/60 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        <div className="absolute inset-0 opacity-[0.06]">
          <Image src="/banner-bags.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink-500">
                Our Catalog
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl xl:text-5xl">
                Premium Non-Woven Bags
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                Custom bags in 50+ variants — multiple colors, sizes and shapes designed for shops, brands and bulk B2B orders with slab-based pricing.
              </p>

              {/* Quick stat pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { label: "MOQ", value: "200 KG" },
                  { label: "Pricing", value: "Per KG Slab" },
                  { label: "Custom", value: "Logo Printing" },
                  { label: "GSM", value: "40 – 120" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200/80">
                    <span className="text-zinc-400">{label}: </span>{value}
                  </div>
                ))}
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
              {[
                { value: "53+",      label: "Products" },
                { value: "4 Types",  label: "Bag Shapes" },
                { value: "120 GSM",  label: "Max Thickness" },
                { value: "200 KG",   label: "Min. Order" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-2xl bg-white/80 px-4 py-3.5 shadow-sm ring-1 ring-zinc-200/60 backdrop-blur-sm">
                  <p className="text-xl font-bold text-zinc-900">{value}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shape quick-filters */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 mr-1">Browse by:</span>
            {SHAPE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setShape(shape === s ? "" : s)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition duration-150 ${
                  shape === s
                    ? "bg-pink-500 text-white shadow-md"
                    : "bg-white/90 text-zinc-700 shadow-sm ring-1 ring-zinc-200 hover:ring-pink-300 hover:text-pink-600"
                }`}
              >
                {s}
              </button>
            ))}
            {shape && (
              <button
                onClick={() => setShape("")}
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Body: sidebar + grid ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
            <div className="sticky top-[90px] overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-zinc-900">Filters</p>
                  {activeCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                      {activeCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="px-5 py-2">
                {FilterPanel}
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="min-w-0 flex-1">

            {/* Search + sort bar */}
            <div className="sticky top-[73px] z-30 -mx-4 bg-[#f7f7fb]/95 px-4 pb-4 pt-0 backdrop-blur-md sm:-mx-0 sm:px-0">
              <div className="flex gap-2">
                {/* Search */}
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition focus-within:ring-pink-300">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search bags, shapes, colors…"
                    className="w-full bg-transparent py-3.5 pl-11 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
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

                {/* Sort */}
                <div className="relative hidden sm:block">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-full appearance-none cursor-pointer rounded-2xl border-0 bg-white py-3.5 pl-4 pr-9 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200 outline-none transition focus:ring-pink-300"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen((p) => !p)}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold shadow-sm ring-1 transition lg:hidden ${
                    mobileFiltersOpen || activeCount > 0
                      ? "bg-pink-500 text-white ring-pink-500"
                      : "bg-white text-zinc-700 ring-zinc-200"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeCount > 0 && (
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      mobileFiltersOpen || activeCount > 0 ? "bg-white text-pink-600" : "bg-pink-500 text-white"
                    }`}>
                      {activeCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile filter panel */}
              {mobileFiltersOpen && (
                <div ref={mobileFilterRef} className="mt-2 overflow-hidden rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-zinc-200 lg:hidden">
                  {FilterPanel}
                </div>
              )}

              {/* Active filter pills */}
              {hasFilters && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {search && (
                    <span className="flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-[11px] font-semibold text-pink-600 ring-1 ring-pink-100">
                      &ldquo;{search}&rdquo;
                      <button onClick={() => setSearch("")}><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {shape && (
                    <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-600">
                      Shape: {shape}
                      <button onClick={() => setShape("")}><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {color && (
                    <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-600">
                      Color: {color}
                      <button onClick={() => setColor("")}><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {gsm && (
                    <span className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-600">
                      {gsm} GSM
                      <button onClick={() => setGsm("")}><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="ml-1 text-[11px] font-semibold text-zinc-400 underline-offset-2 hover:text-zinc-600 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Results header */}
            {!loading && products.length > 0 && (
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">
                    {hasFilters ? "Filtered Results" : "All Products"}
                  </h2>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    {products.length} product{products.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-5 rounded-[2rem] bg-white py-20 text-center shadow-sm ring-1 ring-zinc-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100">
                  <ShoppingBag className="h-8 w-8 text-zinc-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">No products found</h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    Try adjusting your search or filters.
                  </p>
                </div>
                <button
                  onClick={clearFilters}
                  className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
