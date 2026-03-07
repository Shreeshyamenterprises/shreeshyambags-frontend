import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { Product, Variant } from "@/types";
import { VariantSelector } from "@/components/products/variant-selector";
import { ProductGallery } from "@/components/products/product-gallery";

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

  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
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
                  Customization
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Print Text Available
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Variants
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  {product.variants?.length ?? 0} options
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                Premium Non-Woven Bag
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                {product.title}
              </h1>

              <p className="mt-5 text-base leading-7 text-zinc-600">
                {product.description ||
                  "Premium reusable and customizable non-woven bag for modern stores and businesses."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-medium text-pink-600">
                  Reusable
                </span>
                <span className="rounded-full bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700">
                  Brand Friendly
                </span>
                <span className="rounded-full bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700">
                  Bulk Order Ready
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-pink-50 via-white to-fuchsia-50 p-6 shadow-sm ring-1 ring-pink-100 sm:p-8">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Customize & Order
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Select your preferred size, color and shape, add custom print
                  text and place your order easily.
                </p>
              </div>

              <VariantSelector variants={product.variants ?? []} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
                <p className="text-sm font-semibold text-zinc-900">Ideal For</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Boutiques, grocery stores, sweet shops, gift packaging and
                  daily business carry use.
                </p>
              </div>

              <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
                <p className="text-sm font-semibold text-zinc-900">
                  Brand Visibility
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Every printed bag works like moving brand promotion after each
                  customer purchase.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-zinc-900 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">
                Smart Packaging Choice
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                A good non-woven bag is not just packaging — it adds style,
                utility and repeated visibility to your brand every time it is
                reused.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
