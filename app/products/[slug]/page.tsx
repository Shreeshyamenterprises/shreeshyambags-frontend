import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle2, ChevronRight, Recycle, Award,
  Truck, BadgePercent, Printer,
} from "lucide-react";
import { api } from "@/lib/api";
import { Product, Variant } from "@/types";
import { ProductGallery } from "@/components/products/product-gallery";
import { PremiumQuotePanel } from "@/components/products/premium-quote-panel";
import { BulkQuoteForm } from "@/components/products/bulk-quote-form";

async function getProduct(
  slug: string,
): Promise<(Product & { variants: Variant[] }) | null> {
  try {
    const res = await api.get(`/products/${slug}`, {
      headers: { "Cache-Control": "no-store" },
    });
    return res.data;
  } catch {
    return null;
  }
}

const COLOR_MAP: Record<string, string> = {
  White: "#f5f5f5", Black: "#1a1a1a", Blue: "#3b82f6", Navy: "#1e3a8a",
  Red: "#ef4444", Green: "#22c55e", Pink: "#ec4899", Gold: "#f59e0b",
  Silver: "#94a3b8", Purple: "#a855f7", Orange: "#f97316", Maroon: "#7f1d1d",
  Burgundy: "#7f1d1d", Beige: "#d4b896", Cream: "#fef3c7", Brown: "#92400e",
  Denim: "#1d4ed8", Khaki: "#a16207", Saffron: "#f59e0b", Yellow: "#eab308",
  Grey: "#9ca3af",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const firstVariant = product.variants?.[0] ?? null;
  const allGsms   = [...new Set((product.variants ?? []).map((v) => v.gsm).filter((g): g is number => g != null))].sort((a,b) => a-b);
  const allShapes = [...new Set((product.variants ?? []).map((v) => v.shape).filter(Boolean))];
  const allColors = [...new Set((product.variants ?? []).map((v) => v.color).filter(Boolean))];
  const allSizes  = [...new Set((product.variants ?? []).map((v) => v.size).filter(Boolean))];

  const minPrice = product.basePrice ?? 0;

  return (
    <main className="min-h-screen bg-[#f7f7fb]">

      {/* ── Breadcrumb + top strip ── */}
      <div className="border-b border-zinc-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Link href="/" className="transition hover:text-zinc-700">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="transition hover:text-zinc-700">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-zinc-700 line-clamp-1">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* ── Main two-column: gallery + quote panel ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_480px] lg:items-start xl:grid-cols-[1fr_520px]">

          {/* ── Left: Gallery + product info ── */}
          <div className="space-y-5">

            {/* Gallery */}
            <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-zinc-100">
              <ProductGallery images={product.images ?? []} />
            </div>

            {/* Product title block (mobile: shows here; desktop: hidden — shown in right col) */}
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-zinc-100 lg:hidden">
              <div className="px-5 py-5">
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-500 ring-1 ring-pink-100">
                    Non-Woven
                  </span>
                  {firstVariant?.gsm && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600">
                      {firstVariant.gsm} GSM
                    </span>
                  )}
                  {allShapes[0] && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600">
                      {allShapes[0]}
                    </span>
                  )}
                </div>
                <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-zinc-900">
                  {product.title}
                </h1>
                {product.description && (
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{product.description}</p>
                )}
                {minPrice > 0 && (
                  <p className="mt-3 text-2xl font-bold text-zinc-900">
                    ₹{(minPrice / 100).toFixed(0)}
                    <span className="ml-1 text-sm font-medium text-zinc-400">/kg onwards</span>
                  </p>
                )}
              </div>
            </div>

            {/* ── Spec table ── */}
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Product Specifications
                </h2>
              </div>
              <div className="divide-y divide-zinc-50">
                {allSizes.length > 0 && (
                  <div className="flex items-start justify-between gap-4 px-6 py-3.5">
                    <span className="text-sm text-zinc-500">Sizes</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {allSizes.map((s) => (
                        <span key={s} className="rounded-lg bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-zinc-100">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {allColors.length > 0 && (
                  <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                    <span className="text-sm text-zinc-500">Colors</span>
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      {allColors.map((c) => (
                        <span
                          key={c}
                          title={c}
                          className="h-5 w-5 rounded-full border border-white shadow-sm ring-1 ring-zinc-200"
                          style={{ backgroundColor: COLOR_MAP[c] ?? "#e5e7eb" }}
                        />
                      ))}
                      <span className="text-xs text-zinc-400">{allColors.length} colors</span>
                    </div>
                  </div>
                )}
                {allShapes.length > 0 && (
                  <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                    <span className="text-sm text-zinc-500">Shapes</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {allShapes.map((s) => (
                        <span key={s} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {allGsms.length > 0 && (
                  <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                    <span className="text-sm text-zinc-500">GSM Range</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {allGsms.map((g) => (
                        <span key={g} className="rounded-full bg-pink-50 px-2.5 py-0.5 text-xs font-semibold text-pink-500 ring-1 ring-pink-100">{g} GSM</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <span className="text-sm text-zinc-500">Material</span>
                  <span className="text-sm font-medium text-zinc-900">Non-Woven Polypropylene</span>
                </div>
                <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <span className="text-sm text-zinc-500">Min. Order Qty</span>
                  <span className="text-sm font-bold text-zinc-900">200 KG</span>
                </div>
                <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <span className="text-sm text-zinc-500">Custom Printing</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-6 py-3.5">
                  <span className="text-sm text-zinc-500">Total Variants</span>
                  <span className="text-sm font-bold text-zinc-900">{product.variants?.length ?? 0} variants</span>
                </div>
              </div>
            </div>

            {/* ── Features ── */}
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Why Choose This Bag?
                </h2>
              </div>
              <ul className="divide-y divide-zinc-50 px-6">
                {[
                  "Perfect for grocery stores, boutiques, garment shops and retail packaging.",
                  "Printed bags boost your brand visibility every time customers reuse them.",
                  "Bulk slab pricing per KG — ideal for wholesale and B2B orders.",
                  "Reusable, eco-friendly and plastic-ban compliant packaging solution.",
                  "Multiple GSM options — from lightweight 40 GSM to heavy-duty 120 GSM.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 py-3.5 text-sm text-zinc-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: sticky quote panel ── */}
          <div className="space-y-5 lg:sticky lg:top-[90px]">

            {/* Product title (desktop only) */}
            <div className="hidden overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-zinc-100 lg:block">
              <div className="px-6 py-5">
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-500 ring-1 ring-pink-100">
                    Non-Woven
                  </span>
                  {firstVariant?.gsm && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600">
                      {firstVariant.gsm} GSM
                    </span>
                  )}
                  {allShapes[0] && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600">
                      {allShapes[0]}
                    </span>
                  )}
                </div>
                <h1 className="mt-2.5 text-xl font-bold tracking-tight text-zinc-900 xl:text-2xl">
                  {product.title}
                </h1>
                {product.description && (
                  <p className="mt-1.5 text-sm leading-6 text-zinc-500">{product.description}</p>
                )}
                {minPrice > 0 && (
                  <div className="mt-3 flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-zinc-900">
                      ₹{(minPrice / 100).toFixed(0)}
                    </p>
                    <span className="text-sm font-medium text-zinc-400">/kg onwards</span>
                  </div>
                )}
              </div>

              {/* Trust bar */}
              <div className="grid grid-cols-3 divide-x divide-zinc-100 border-t border-zinc-100">
                {[
                  { icon: Recycle,      label: "Eco-Friendly" },
                  { icon: Printer,      label: "Custom Print" },
                  { icon: BadgePercent, label: "Bulk Pricing" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 py-3.5">
                    <Icon className="h-4 w-4 text-pink-400" />
                    <span className="text-[10px] font-semibold text-zinc-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote panel */}
            <PremiumQuotePanel
              productTitle={product.title}
              variants={product.variants ?? []}
            />

            {/* Delivery note */}
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3.5 shadow-sm">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
              <p className="text-xs leading-5 text-zinc-500">
                Bulk orders dispatched within <span className="font-semibold text-zinc-700">7–10 working days</span> after order confirmation. Custom printing adds 3–5 days.
              </p>
            </div>

            {/* Quality badge */}
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3.5 shadow-sm">
              <Award className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
              <p className="text-xs leading-5 text-zinc-500">
                All bags manufactured at our <span className="font-semibold text-zinc-700">ISO-compliant facility</span> using premium PP non-woven fabric.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bulk Quote Form ── */}
        <div className="mt-10">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Request a Custom Quote
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <BulkQuoteForm
            productId={product.id}
            productTitle={product.title}
            variants={product.variants ?? []}
          />
        </div>

        {/* ── Back link ── */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-600 shadow-sm transition hover:border-pink-300 hover:text-pink-600"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to all products
          </Link>
        </div>

      </div>
    </main>
  );
}
