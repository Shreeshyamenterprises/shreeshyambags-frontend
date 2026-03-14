"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types";

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function updatePosition() {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="rounded-[1.25rem] border border-zinc-200 bg-white p-2 shadow-sm transition hover:shadow-md">
      <label className="mb-1 block px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-[0.95rem] bg-zinc-50 px-4 py-2.5 text-left text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
      >
        <span>{value || `All ${label}`}</span>

        <svg
          className={`h-4 w-4 text-zinc-400 transition ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[9999] max-h-[200px] overflow-y-auto rounded-[1rem] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-3 text-left text-[13px] transition ${
                  value === ""
                    ? "bg-pink-50 font-semibold text-pink-600"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {value === "" ? <span>✓</span> : <span className="w-[12px]" />}
                All {label}
              </button>

              {options.map((option) => {
                const selected = value === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "bg-pink-50 font-semibold text-pink-600"
                        : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {selected ? <span>✓</span> : <span className="w-[12px]" />}
                    {option}
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function StatPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200/80 backdrop-blur">
      <span className="text-zinc-500">{title}: </span>
      <span className="font-semibold text-zinc-900">{value}</span>
    </div>
  );
}

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

  const hasActiveFilters = useMemo(() => {
    return Boolean(search || size || color || shape);
  }, [search, size, color, shape]);

  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="relative overflow-hidden border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        <div className="absolute inset-0 opacity-[0.08]">
          <Image
            src="/banner-bags.png"
            alt="Premium non woven bags"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-5">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                Our Collection
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                Find the perfect non woven bag for your business
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Browse premium custom bags in different colors, sizes and
                shapes. Designed for shops, brands, gifting and bulk orders with
                strong pricing and reusable packaging value.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <StatPill title="Bulk Orders" value="200 KG MOQ" />
                <StatPill title="Customization" value="Logo Printing" />
                <StatPill title="Pricing" value="Per KG" />
              </div>
            </div>

            {/* <div className="hidden lg:block">
              <div className="relative ml-auto aspect-[5/4] w-full max-w-xl overflow-hidden rounded-[2.25rem] bg-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.10)] ring-1 ring-white/60 backdrop-blur">
                <Image
                  src="/banner.png"
                  alt="Non woven bags collection"
                  fill
                  className="object-cover"
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.5rem] bg-white/90 p-4 shadow-sm ring-1 ring-zinc-100 backdrop-blur">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
                  Filter Products
                </p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-900">
                  Explore by size, color and bag shape
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Use the search and smart filters to quickly find the right bag
                  style.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-zinc-50 px-4 py-2 text-sm text-zinc-600 ring-1 ring-zinc-200">
                  Showing{" "}
                  <span className="font-semibold text-zinc-900">
                    {products.length}
                  </span>{" "}
                  products
                </div>

                <button
                  onClick={clearFilters}
                  className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                  disabled={!hasActiveFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="relative z-30 grid gap-3 overflow-visible xl:grid-cols-[1.45fr_1fr_1fr_1fr]">
              <div className="rounded-[1.25rem] border border-zinc-200 bg-white p-2 shadow-sm transition hover:shadow-md">
                <label className="mb-2 block px-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Search
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bags, categories, styles..."
                    className="w-full rounded-[1rem] border border-transparent bg-zinc-50 px-4 py-3 pl-11 text-sm font-medium text-zinc-800 outline-none transition focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                    🔍
                  </span>
                </div>
              </div>

              <FilterSelect
                label="Size"
                value={size}
                onChange={setSize}
                options={["Small", "Medium", "Large", "Extra Large"]}
              />

              <FilterSelect
                label="Color"
                value={color}
                onChange={setColor}
                options={[
                  "Mint",
                  "Grey Shade",
                  "White",
                  "Black",
                  "Pink",
                  "Blue",
                  "Red",
                ]}
              />

              <FilterSelect
                label="Shape"
                value={shape}
                onChange={setShape}
                options={["D-Cut", "W-Cut", "Loop Handle", "Rectangle"]}
              />
            </div>

            {hasActiveFilters ? (
              <div className="flex flex-wrap gap-2">
                {search ? (
                  <span className="rounded-full bg-pink-50 px-3 py-2 text-xs font-semibold text-pink-600 ring-1 ring-pink-100">
                    Search: {search}
                  </span>
                ) : null}
                {size ? (
                  <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200">
                    Size: {size}
                  </span>
                ) : null}
                {color ? (
                  <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200">
                    Color: {color}
                  </span>
                ) : null}
                {shape ? (
                  <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200">
                    Shape: {shape}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="relative z-0 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div className="relative z-30 overflow-visible rounded-[1.5rem] bg-white/90 p-4 shadow-sm ring-1 ring-zinc-100 backdrop-blur">
                  <div className="aspect-[4/4.5] animate-pulse rounded-[1.5rem] bg-zinc-200" />
                  <div className="mt-5 space-y-3">
                    <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
                    <div className="h-8 w-1/3 animate-pulse rounded bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-zinc-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-2xl">
                👜
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-zinc-900">
                No products found
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Try changing your search or filter options to explore more bag
                styles.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900">
                    Premium bag collection
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    Select from reusable, customizable and business-ready bag
                    options.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
