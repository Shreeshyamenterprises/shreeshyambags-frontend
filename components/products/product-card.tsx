"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Product } from "@/types";

const COLOR_MAP: Record<string, string> = {
  White: "#f5f5f5", Black: "#1a1a1a", Blue: "#3b82f6", Navy: "#1e3a8a",
  Red: "#ef4444", Green: "#22c55e", Pink: "#ec4899", Gold: "#f59e0b",
  Silver: "#94a3b8", Purple: "#a855f7", Orange: "#f97316", Maroon: "#7f1d1d",
  Burgundy: "#7f1d1d", Beige: "#d4b896", Cream: "#fef3c7", Brown: "#92400e",
  Denim: "#1d4ed8", Khaki: "#a16207", Saffron: "#f59e0b", Yellow: "#eab308",
  Grey: "#9ca3af",
};

export function ProductCard({ product }: { product: Product }) {
  const imageUrl     = product.images?.[0]?.url;
  const firstVariant = product.variants?.[0];

  const shapes  = [...new Set((product.variants ?? []).map((v) => v.shape).filter(Boolean))];
  const colors  = [...new Set((product.variants ?? []).map((v) => v.color).filter(Boolean))];
  const gsms    = [...new Set((product.variants ?? []).map((v) => v.gsm).filter((g): g is number => g != null))].sort((a, b) => a - b);
  const minPrice = product.basePrice ?? 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-zinc-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)] hover:ring-zinc-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-zinc-300" />
          </div>
        )}

        {/* Dark scrim on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/30 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {firstVariant?.gsm && (
            <span className="rounded-full bg-zinc-900/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              {firstVariant.gsm} GSM
            </span>
          )}
          {shapes[0] && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-pink-600 backdrop-blur-sm shadow-sm">
              {shapes[0]}
            </span>
          )}
        </div>

        {/* Variant count badge */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-zinc-700 shadow-sm backdrop-blur-sm">
              {product.variants!.length} variants
            </span>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-zinc-900/80 to-transparent px-4 pb-4 pt-10 transition-all duration-300 group-hover:translate-y-0">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="mb-3 flex items-center gap-1.5">
            {colors.slice(0, 6).map((c) => (
              <span
                key={c}
                title={c}
                className="h-4 w-4 rounded-full border border-white shadow-sm ring-1 ring-zinc-200"
                style={{ backgroundColor: COLOR_MAP[c] ?? "#e5e7eb" }}
              />
            ))}
            {colors.length > 6 && (
              <span className="text-[10px] font-medium text-zinc-400">+{colors.length - 6}</span>
            )}
          </div>
        )}

        <h3 className="line-clamp-1 text-sm font-bold tracking-tight text-zinc-900 transition duration-200 group-hover:text-pink-600 sm:text-base">
          {product.title}
        </h3>

        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-5 text-zinc-500">
          {product.description || "Premium customizable non-woven bag for retail and bulk orders."}
        </p>

        {/* GSM chips */}
        {gsms.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {gsms.slice(0, 3).map((g) => (
              <span key={g} className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-500 ring-1 ring-pink-100">
                {g} GSM
              </span>
            ))}
          </div>
        )}

        {/* Price row */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-50 pt-3.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">From</p>
            <p className="mt-0.5 text-base font-bold text-zinc-900 sm:text-lg">
              ₹{(minPrice / 100).toFixed(0)}
              <span className="ml-1 text-xs font-medium text-zinc-400">/kg</span>
            </p>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-[11px] font-semibold text-white transition duration-200 group-hover:bg-pink-600">
            Order Now
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
