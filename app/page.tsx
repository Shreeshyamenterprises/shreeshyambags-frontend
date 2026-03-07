import { Hero } from "@/components/home/hero";
import Link from "next/link";

const categories = [
  {
    title: "D-Cut Bags",
    description: "Simple, practical and popular for retail and grocery use.",
  },
  {
    title: "W-Cut Bags",
    description: "Comfortable carry style for sweet shops and daily packaging.",
  },
  {
    title: "Printed Bags",
    description:
      "Custom brand print options for boutiques, gifting and events.",
  },
  {
    title: "Bulk Orders",
    description: "Large quantity customized bag solutions for businesses.",
  },
];

const highlights = [
  "Custom size, color and shape options",
  "Brand printing for shops and businesses",
  "Reusable and eco-friendly bag collection",
  "Bulk order support with easy management",
];

export default function HomePage() {
  return (
    <main className="bg-[#faf7fb] text-zinc-900">
      <Hero />

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
            Featured Collection
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Bags designed for modern stores and growing brands
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Explore aesthetic, durable and customizable non woven bag styles
            crafted for everyday business use.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-100 to-fuchsia-100" />

              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {item.description}
              </p>

              <Link
                href="/products"
                className="mt-5 inline-flex text-sm font-semibold text-pink-500 hover:text-pink-600"
              >
                Explore now →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y border-zinc-200/70 bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Why Choose Us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A complete bag solution for shops, brands and wholesale buyers
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
              From basic carry bags to premium printed packaging, our non woven
              bag collection is built to support practical use, branding needs
              and repeat business orders.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100"
              >
                <div className="mb-3 h-3 w-3 rounded-full bg-pink-500" />
                <p className="text-sm font-medium leading-6 text-zinc-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand / Custom Order Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-gradient-to-br from-pink-100 via-rose-50 to-fuchsia-100 p-8 shadow-sm ring-1 ring-pink-100">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">
              Custom Printing
            </p>
            <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
              Add your shop name, logo or branding on every bag
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-700 sm:text-base">
              Perfect for sweet shops, clothing stores, boutiques, grocery
              stores and gifting brands looking for attractive and reusable
              packaging.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Request Custom Order
            </Link>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Easy Shopping
            </p>
            <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
              Choose variants, add print text and order with confidence
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
              Customers can browse products, select size and color variants, add
              custom text and place orders through a smooth shopping experience.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-zinc-900 px-6 py-12 text-center text-white sm:px-10 lg:px-16 lg:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">
              Start Shopping
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Discover bags that look premium and work beautifully
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              Explore our latest non woven bag collection with customizable
              sizes, shapes and colors for every business need.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Shop Now
              </Link>

              <Link
                href="/contact"
                className="inline-flex rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
