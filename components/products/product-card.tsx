import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]?.url;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-zinc-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-zinc-100 to-zinc-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No Image
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-500 backdrop-blur">
          Eco Bag
        </div>
      </div>

      <div className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-zinc-900">
              {product.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
              {product.description || "Premium customizable non woven bag."}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Starting from
            </p>
            <p className="mt-1 text-xl font-bold text-zinc-900">
              ₹{((product.basePrice ?? 0) / 100).toFixed(2)}
            </p>
          </div>

          <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600 transition group-hover:bg-pink-100">
            View
          </div>
        </div>
      </div>
    </Link>
  );
}
