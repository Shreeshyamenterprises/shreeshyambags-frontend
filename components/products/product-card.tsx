"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]?.url;
  const firstVariant = product.variants?.[0];
  const price = product.basePrice ?? 0;

  const shapes = [...new Set((product.variants ?? []).map((v) => v.shape).filter(Boolean))];
  const gsms   = [...new Set((product.variants ?? []).map((v) => v.gsm).filter(Boolean))];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-zinc-200">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3.5] overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-zinc-300" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-zinc-900/0 transition duration-300 group-hover:bg-zinc-900/10" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-600 shadow-sm backdrop-blur-sm">
              Eco Bag
            </span>
            {firstVariant?.gsm && (
              <span className="rounded-full bg-zinc-900/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                {firstVariant.gsm} GSM
              </span>
            )}
          </div>

          {/* Quick view */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-zinc-900/80 to-transparent px-4 pb-4 pt-8 transition-all duration-300 group-hover:translate-y-0">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Eye className="h-3.5 w-3.5" />
              View Details
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Shape tags */}
        {shapes.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {shapes.slice(0, 3).map((shape) => (
              <span
                key={shape}
                className="rounded-full bg-zinc-50 px-2.5 py-0.5 text-[11px] font-medium text-zinc-500 ring-1 ring-zinc-100"
              >
                {shape}
              </span>
            ))}
            {gsms.slice(0, 2).map((gsm) => (
              <span
                key={gsm}
                className="rounded-full bg-pink-50 px-2.5 py-0.5 text-[11px] font-medium text-pink-500 ring-1 ring-pink-100"
              >
                {gsm} GSM
              </span>
            ))}
          </div>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 text-base font-bold tracking-tight text-zinc-900 transition group-hover:text-pink-600">
            {product.title}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-5 text-zinc-500">
          {product.description || "Premium customizable non-woven bag for retail and bulk orders."}
        </p>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-50 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Starting from
            </p>
            <p className="mt-0.5 text-lg font-bold text-zinc-900">
              ₹{(price / 100).toFixed(2)}
              <span className="ml-1 text-xs font-medium text-zinc-400">/kg</span>
            </p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-700"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
