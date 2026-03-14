import { notFound } from "next/navigation";
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
      headers: {
        "Cache-Control": "no-store",
      },
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

  if (!product) {
    notFound();
  }

  const firstVariant = product.variants?.[0] ?? null;

  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
            Premium Non-Woven Bags
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            {product.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 sm:text-base">
            {product.description ||
              "Premium reusable and customizable non-woven bags for retailers, grocery stores, boutiques and bulk business orders."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-pink-600 shadow-sm ring-1 ring-pink-100">
              Custom Printing
            </span>
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
              Bulk Orders
            </span>
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
              Per Kg Pricing
            </span>
            <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
              {firstVariant?.gsm ? `${firstVariant.gsm} GSM` : "GSM Available"}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-zinc-100 sm:p-6">
              <ProductGallery images={product.images ?? []} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Category
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Non-Woven Bags
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Bulk Pricing
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  200 / 500 / 1000 KG
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Printing
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Logo / Text Supported
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 sm:p-8">
              <h2 className="text-xl font-semibold text-zinc-900">
                Why choose this bag?
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    Ideal For
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Grocery stores, boutiques, garment stores, sweet shops and
                    daily retail packaging.
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    Branding Value
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Printed bags keep your brand visible every time the customer
                    reuses them.
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    Business Friendly
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Bulk quantity slabs and per kg pricing make this ideal for
                    wholesale and repeat orders.
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    Premium Look
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Reusable, practical and visually appealing packaging for
                    modern businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <PremiumQuotePanel
              productTitle={product.title}
              variants={product.variants ?? []}
            />
          </div>
          <BulkQuoteForm
            productId={product.id}
            productTitle={product.title}
            variants={product.variants ?? []}
          />
        </div>
      </section>
    </main>
  );
}
