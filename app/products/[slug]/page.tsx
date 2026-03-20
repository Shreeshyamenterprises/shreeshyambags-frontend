import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const firstVariant = product.variants?.[0] ?? null;
  const allGsms    = [...new Set((product.variants ?? []).map((v) => v.gsm).filter(Boolean))];
  const allShapes  = [...new Set((product.variants ?? []).map((v) => v.shape).filter(Boolean))];
  const allColors  = [...new Set((product.variants ?? []).map((v) => v.color).filter(Boolean))];

  return (
    <main className="min-h-screen bg-[#f7f7fb]">

      {/* Hero with background image — same style as home page */}
      <section className="relative overflow-hidden border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        {/* Background image */}
        <div className="absolute inset-0 opacity-[0.07]">
          <Image
            src="/banner-bags.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Ambient blobs */}
        <div className="absolute -left-16 top-6 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-fuchsia-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-zinc-700">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-zinc-700">{product.title}</span>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
            Premium Non-Woven Bag
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {product.title}
          </h1>
          {product.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              {product.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {firstVariant?.gsm && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                {firstVariant.gsm} GSM
              </span>
            )}
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
              MOQ 200 KG
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-pink-600 shadow-sm ring-1 ring-pink-100">
              Custom Printing
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ── Main two-column ── */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">

          {/* Left: Gallery + details — fixed to image width */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100">
              <ProductGallery images={product.images ?? []} />
            </div>

            {/* Product info below gallery */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-5 py-4">
                <h2 className="text-sm font-bold text-zinc-900">Product Details</h2>
              </div>
              <div className="divide-y divide-zinc-50 px-5 text-sm">
                {allShapes.length > 0 && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-zinc-500">Shapes</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {allShapes.map((s) => (
                        <span key={s} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {allColors.length > 0 && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-zinc-500">Colors</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {allColors.map((c) => (
                        <span key={c} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                {allGsms.length > 0 && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-zinc-500">GSM</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {allGsms.map((g) => (
                        <span key={g} className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-medium text-pink-600 ring-1 ring-pink-100">{g} GSM</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between py-3">
                  <span className="text-zinc-500">Material</span>
                  <span className="font-medium text-zinc-900">Non-Woven Polypropylene</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-zinc-500">MOQ</span>
                  <span className="font-medium text-zinc-900">200 KG</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-zinc-500">Custom Printing</span>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-green-100">Supported</span>
                </div>
              </div>
            </div>

            {/* Why choose — compact checklist */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-5 py-4">
                <h2 className="text-sm font-bold text-zinc-900">Why Choose This Bag?</h2>
              </div>
              <ul className="divide-y divide-zinc-50 px-5">
                {[
                  "Ideal for grocery stores, boutiques, garment stores and retail packaging.",
                  "Printed bags keep your brand visible every time customers reuse them.",
                  "Bulk quantity slabs with per kg pricing — perfect for wholesale orders.",
                  "Reusable, eco-friendly and plastic-compliant packaging.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 py-3 text-sm text-zinc-600">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Product title + quote panel (sticky) */}
          <div className="space-y-4 lg:sticky lg:top-20">
            {/* Title block */}
            <div className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-zinc-100">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pink-500 ring-1 ring-pink-100">
                  Non-Woven
                </span>
                {firstVariant?.gsm && (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    {firstVariant.gsm} GSM
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-xl font-bold tracking-tight text-zinc-900">
                {product.title}
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-zinc-500">
                {product.description ||
                  "Premium customizable non-woven bags for retail and bulk business orders."}
              </p>
            </div>

            {/* Quote panel */}
            <PremiumQuotePanel
              productTitle={product.title}
              variants={product.variants ?? []}
            />
          </div>
        </div>

        {/* ── Bulk Quote Form ── */}
        <div className="mt-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Request a Custom Quote</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <BulkQuoteForm
            productId={product.id}
            productTitle={product.title}
            variants={product.variants ?? []}
          />
        </div>

      </div>
    </main>
  );
}
