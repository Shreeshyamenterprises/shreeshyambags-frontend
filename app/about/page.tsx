import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Factory,
  Leaf,
  Package,
  Printer,
  ShieldCheck,
  Star,
  Truck,
  Users,
} from "lucide-react";

const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "1000+", label: "Bulk Orders Delivered" },
  { value: "50+", label: "Bag Variants" },
  { value: "200 KG", label: "Minimum Order Qty" },
];

const values = [
  {
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    title: "Eco-Friendly",
    body: "Every bag we make is reusable and plastic-compliant, helping businesses reduce their environmental footprint.",
  },
  {
    icon: <Printer className="h-5 w-5 text-pink-500" />,
    title: "Custom Branding",
    body: "Logo, brand name, artwork — we support multi-color printing to make your bags a walking advertisement.",
  },
  {
    icon: <Factory className="h-5 w-5 text-blue-500" />,
    title: "In-House Manufacturing",
    body: "We control every step from raw material to finished bag, ensuring consistent quality and fast turnaround.",
  },
  {
    icon: <Package className="h-5 w-5 text-orange-500" />,
    title: "Bulk-First Pricing",
    body: "Structured per-kg pricing slabs at 200 KG, 500 KG and 1000 KG so your cost goes down as your order grows.",
  },
  {
    icon: <Truck className="h-5 w-5 text-purple-500" />,
    title: "Reliable Dispatch",
    body: "We understand business timelines. Orders are packed and dispatched on schedule every time.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
    title: "Quality Assurance",
    body: "GSM-accurate fabric, strong stitching and color-fast printing — each batch goes through quality checks before shipping.",
  },
];

const whyUs = [
  "Wide range of sizes, shapes, colors and GSM options",
  "D-Cut, W-Cut, Loop Handle and Rectangle bag styles",
  "Single and multi-color custom logo printing",
  "Serving grocery stores, boutiques, garment shops, sweet shops and brands",
  "Transparent per-kg pricing with no hidden charges",
  "Repeat order friendly — consistent quality batch to batch",
];

const bagTypes = [
  { title: "D-Cut Bags", image: "/D-cut bags.jpeg", desc: "Lightweight & popular for everyday retail use." },
  { title: "W-Cut Bags", image: "/w-cut bags.jpeg", desc: "Strong carry bags for grocery & wholesale." },
  { title: "Loop Handle", image: "/Loop handle.jpeg", desc: "Premium feel for boutiques & gifting brands." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f7fb]">

      {/* ── Hero ── */}
      <section className="relative flex min-h-[320px] flex-col justify-center overflow-hidden border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        <div className="absolute inset-0 opacity-[0.07]">
          <Image src="/banner-bags.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-16">
          {/* Left: text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-500">
              About PieBags
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Bags Built for Businesses, Brands &amp; Bulk Orders
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
              A non-woven bag manufacturer making durable, reusable and custom-printed bags
              for retailers, grocery stores, boutiques and bulk buyers.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                View Our Products
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-zinc-300 bg-white/80 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-white"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Right: stats */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl bg-white/80 px-5 py-4 shadow-sm ring-1 ring-zinc-200/60 backdrop-blur-sm">
                <p className="text-2xl font-bold text-zinc-900">{value}</p>
                <p className="mt-0.5 text-xs font-medium text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-zinc-900 sm:text-4xl">{value}</p>
                <p className="mt-1 text-xs font-medium text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/factory.png"
                alt="Our factory"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 divide-x divide-zinc-100 border-t border-zinc-100">
              {[
                { icon: <Factory className="h-4 w-4" />, label: "In-House Factory" },
                { icon: <Users className="h-4 w-4" />, label: "Expert Team" },
                { icon: <Star className="h-4 w-4" />, label: "Premium Quality" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-4 text-xs font-medium text-zinc-500">
                  <span className="text-pink-400">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">Our Story</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              A decade of making bags that work for business
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              PieBags started with a single belief — that packaging should do two things at once:
              carry the product and carry the brand. Over the years we have grown into a full-scale
              bag manufacturer serving hundreds of businesses across India.
            </p>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              From a small grocery store ordering 200 kg to a national gifting brand ordering thousands,
              we handle every requirement with the same attention to quality, print accuracy and on-time delivery.
            </p>
            <div className="mt-6 space-y-3">
              {whyUs.slice(0, 4).map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-sm text-zinc-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="border-y border-zinc-200 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">What We Stand For</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Our Core Values</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
              These principles shape how we manufacture, deliver and support every order.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-[#f7f7fb] p-5 ring-1 ring-zinc-100">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-100">
                  {icon}
                </div>
                <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bag Types ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">What We Make</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Our Bag Range</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {bagTypes.map(({ title, image, desc }) => (
            <div key={title} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-1 hover:shadow-md">
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-5 py-4">
                <h3 className="font-bold text-zinc-900">{title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="inline-flex rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            See All Products
          </Link>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="border-t border-zinc-200 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">Why Businesses Trust Us</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                The right partner for your packaging needs
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-500">
                We are not just a supplier — we are a long-term packaging partner that understands
                what bulk buyers, retailers and brands actually need.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {whyUs.map((point) => (
                  <div key={point} className="flex items-start gap-2.5 text-sm text-zinc-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-[#f7f7fb] p-6 ring-1 ring-zinc-100">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="/signup-collage.png"
                  alt="Our products"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-16 pt-14 sm:pb-20 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-14 text-center sm:px-12 lg:px-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #ec4899 0%, transparent 50%), radial-gradient(circle at 80% 30%, #a855f7 0%, transparent 50%)" }}
            />
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-pink-300">
              Let&apos;s Work Together
            </p>
            <h2 className="relative mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to place a bulk order?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-300">
              Explore our full range of non-woven bags or get in touch for a custom quote based on
              your size, GSM, color and printing requirements.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-pink-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Explore Products
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-zinc-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
