"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types";

type StatItem = {
  label: string;
  value: string;
};

type CategoryItem = {
  title: string;
  description: string;
  image: string;
  href: string;
};

type TrustItem = {
  title: string;
  description: string;
};

type ClientLogo = {
  name: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-zinc-600">{description}</p>
      ) : null}
    </div>
  );
}

function StatCard({ label, value }: StatItem) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function CategoryCard({ title, description, image, href }: CategoryItem) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-zinc-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-zinc-900/10 to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
        <div className="mt-4 text-sm font-semibold text-pink-600 transition group-hover:text-pink-700">
          Explore category
        </div>
      </div>
    </Link>
  );
}

function TrustCard({ title, description }: TrustItem) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
    </div>
  );
}

function ClientLogoPill({ name }: ClientLogo) {
  return (
    <div className="flex items-center justify-center rounded-[1.25rem] bg-white px-6 py-4 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-100">
      {name}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await api.get("/products");
      const items = res.data.items ?? res.data ?? [];
      setProducts(items.slice(0, 4));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const stats: StatItem[] = [
    { label: "Product Range", value: "50+" },
    { label: "Bulk Orders", value: "1000+" },
    { label: "Custom Printing", value: "Available" },
    { label: "MOQ", value: "200 KG" },
  ];

  const categories: CategoryItem[] = [
    {
      title: "D-Cut Bags",
      description:
        "Popular for retail stores, medical shops and lightweight packaging.",
      image: "/category-dcut.jpg",
      href: "/products",
    },
    {
      title: "W-Cut Bags",
      description:
        "Strong everyday carry solution for grocery and wholesale usage.",
      image: "/category-wcut.jpg",
      href: "/products",
    },
    {
      title: "Loop Handle Bags",
      description:
        "Premium feel for fashion stores, boutiques and branded packaging.",
      image: "/category-loop.jpg",
      href: "/products",
    },
  ];

  const trustPoints: TrustItem[] = [
    {
      title: "Bulk Manufacturing",
      description:
        "Reliable production capacity for wholesale, distributors and repeat business orders.",
    },
    {
      title: "Custom Printing",
      description:
        "Add logos, brand names and promotional artwork for stronger brand visibility.",
    },
    {
      title: "Multiple GSM Options",
      description:
        "Choose the right GSM based on durability, product category and budget.",
    },
    {
      title: "Business-Focused Supply",
      description:
        "Structured pricing slabs for 200 KG, 500 KG and 1000 KG requirements.",
    },
  ];

  const clientLogos: ClientLogo[] = [
    { name: "Retail Stores" },
    { name: "Grocery Chains" },
    { name: "Boutiques" },
    { name: "Sweet Shops" },
    { name: "Gift Packaging" },
    { name: "Wholesale Buyers" },
  ];

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

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pink-500">
              Shree Shyam Enterprises
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Premium Non Woven Bags for Bulk Business Orders
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
              We manufacture durable, reusable and customizable non woven bags
              for retailers, grocery stores, boutiques and business packaging.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Explore Products
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-zinc-300 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-white"
              >
                Get Bulk Quote
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                MOQ 200 KG
              </span>
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                Per KG Pricing
              </span>
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                Logo Printing
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] ring-1 ring-white/70">
              <Image
                src="/non-woven.jpg"
                alt="Non woven bags"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-zinc-100">
            <div className="relative aspect-[4/3]">
              <Image
                src="/factory.jpg"
                alt="Bag manufacturing setup"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="About Company"
              title="Built for reliable manufacturing and repeat business supply"
              description="Shree Shyam Enterprises focuses on manufacturing non woven bags that balance durability, branding value and practical bulk pricing for businesses."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TrustCard
                title="Consistent Quality"
                description="Every order is prepared with attention to strength, finish and usability for business packaging."
              />
              <TrustCard
                title="Scalable Production"
                description="Suitable for wholesale, distributors and businesses that need repeat quantity supply."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Product Categories"
          title="Popular bag styles for different business needs"
          description="Choose from commonly ordered designs used for retail, grocery, gifting and promotional packaging."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Business-friendly manufacturing with custom options"
          description="A strong mix of bulk order support, product flexibility and branding options."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustPoints.map((item) => (
            <TrustCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-y border-zinc-200 bg-white py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Trusted By Different Business Segments
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {clientLogos.map((item) => (
              <ClientLogoPill key={item.name} name={item.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Products"
          title="Our popular products"
          description="A quick look at selected bag options used by businesses for regular and promotional packaging."
        />

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-zinc-100"
                >
                  <div className="aspect-[4/4.5] animate-pulse rounded-[1.5rem] bg-zinc-200" />
                  <div className="mt-5 space-y-3">
                    <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
              <p className="text-sm text-zinc-600">
                No products available right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2.25rem] bg-zinc-900 px-6 py-12 text-white sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-300">
                Bulk Quote
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Need custom pricing and printing for large quantity orders?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                Contact us for business pricing, custom printing and large order
                support based on your packaging requirements.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                >
                  Browse Products
                </Link>

                <Link
                  href="/contact"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Request Quote
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  Quantity Slabs
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  200 KG, 500 KG and 1000 KG pricing options available.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-sm font-semibold text-white">
                  Custom Branding
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Logo printing and promotional bag customization supported.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
