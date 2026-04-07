"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types";
import {
  ShieldCheck,
  Truck,
  Package,
  Printer,
  Star,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  IndianRupee,
  Factory,
  Headphones,
  Award,
  Leaf,
  ChevronRight,
} from "lucide-react";

function SectionHeading({
  eyebrow,
  title,
  description,
  center,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-500">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-7 text-zinc-500">{description}</p>}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await api.get("/products");
      const items = res.data.items ?? res.data ?? [];
      setProducts(items.slice(0, 4));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7fb]">

      {/* ── HERO ── */}
      <section className="relative flex min-h-[320px] flex-col justify-center overflow-hidden border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        <div className="absolute inset-0 opacity-[0.06]">
          <Image src="/banner-bags.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm ring-1 ring-pink-100">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-zinc-700">Manufacturer · Roorkee, UK</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              Premium Non-Woven Bags{" "}
              <span className="text-pink-600">Directly from Factory</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
              Bulk manufacturer of D-Cut, W-Cut and Loop Handle bags. Custom logo printing available.
              Per-kg pricing for retailers, grocery stores, boutiques and distributors across India.
            </p>

            {/* Trust pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { icon: <ShieldCheck className="h-3.5 w-3.5 text-green-500" />, text: "GST Invoice Available" },
                { icon: <Truck className="h-3.5 w-3.5 text-blue-500" />, text: "Pan India Delivery" },
                { icon: <Printer className="h-3.5 w-3.5 text-pink-500" />, text: "Custom Logo Printing" },
              ].map(({ icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                  {icon}{text}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Browse Products <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/919389517814?text=Hello%2C%20I%20want%20to%20place%20a%20bulk%20order"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-6 py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-100"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Order
              </a>
            </div>
          </div>

          {/* Right: product image with floating badges */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] ring-1 ring-white/70">
              <Image src="/non-woven.jpg" alt="Non woven bags" fill className="object-cover" priority />
            </div>
            {/* Floating badges */}
            <div className="absolute -left-4 bottom-6 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-zinc-100">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Starting from</p>
              <p className="mt-0.5 flex items-center gap-0.5 text-xl font-bold text-zinc-900">
                <IndianRupee className="h-4 w-4" />150<span className="text-sm font-medium text-zinc-400">/kg</span>
              </p>
            </div>
            <div className="absolute -right-4 top-6 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-zinc-100">
              <p className="text-xs font-bold text-pink-500 uppercase tracking-wider">MOQ</p>
              <p className="mt-0.5 text-xl font-bold text-zinc-900">200 KG</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-zinc-100 sm:grid-cols-4">
            {[
              { icon: <Factory className="h-5 w-5 text-pink-500" />,   title: "Direct Manufacturer",  sub: "No middlemen, factory price" },
              { icon: <ShieldCheck className="h-5 w-5 text-green-500" />, title: "GST Invoice",        sub: "Valid tax invoice provided" },
              { icon: <Truck className="h-5 w-5 text-blue-500" />,     title: "Pan India Shipping",   sub: "₹8/kg shipping anywhere" },
              { icon: <Headphones className="h-5 w-5 text-purple-500" />, title: "Same Day Support", sub: "WhatsApp & call support" },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-50 ring-1 ring-zinc-100">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{title}</p>
                  <p className="text-xs text-zinc-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "1000+", label: "Bulk Orders Delivered", color: "text-pink-600" },
            { value: "50+",   label: "Bag Variants Available", color: "text-blue-600" },
            { value: "10+",   label: "Years Manufacturing",   color: "text-emerald-600" },
            { value: "200 KG", label: "Minimum Order Qty",   color: "text-purple-600" },
          ].map(({ value, label, color }) => (
            <div key={label} className="rounded-2xl bg-white px-5 py-6 shadow-sm ring-1 ring-zinc-100">
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW TO ORDER ── */}
      <section className="border-y border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeading center eyebrow="Simple Process" title="How to Place a Bulk Order" description="Order in 3 easy steps — no complicated process." />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", icon: <Package className="h-6 w-6 text-pink-500" />, title: "Browse & Select", desc: "Choose your bag style, size, color and GSM from our catalogue. Add to cart." },
              { step: "02", icon: <IndianRupee className="h-6 w-6 text-emerald-500" />, title: "Place & Pay", desc: "Enter shipping details and complete payment online or contact us for NEFT/UPI transfer." },
              { step: "03", icon: <Truck className="h-6 w-6 text-blue-500" />, title: "Get Delivered", desc: "We pack and dispatch your order. Track delivery and receive anywhere in India." },
            ].map(({ step, icon, title, desc }, i) => (
              <div key={step} className="relative flex gap-4">
                {i < 2 && (
                  <div className="absolute left-[calc(100%-12px)] top-6 hidden h-0.5 w-8 bg-zinc-200 sm:block" />
                )}
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100">
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Step {step}</p>
                  <p className="mt-0.5 font-semibold text-zinc-900">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow="Shop by Type" title="Choose Your Bag Style" description="Popular styles used across retail, grocery, fashion and gifting businesses." />
          <Link href="/products" className="hidden items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700 sm:flex">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            { title: "D-Cut Bags", tag: "Most Popular", image: "/D-cut bags.jpeg", desc: "Best for retail shops, medical stores and lightweight packaging.", color: "bg-pink-500" },
            { title: "W-Cut Bags",  tag: "High Demand",  image: "/w-cut bags.jpeg",  desc: "Strong carry solution for grocery stores and wholesale usage.", color: "bg-blue-500" },
            { title: "Loop Handle", tag: "Premium",       image: "/Loop handle.jpeg", desc: "Premium branded bags for boutiques, fashion stores and gifting.", color: "bg-emerald-500" },
          ].map(({ title, tag, image, desc, color }) => (
            <Link key={title} href="/products" className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={image} alt={title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
                <span className={`absolute left-3 top-3 rounded-full ${color} px-2.5 py-1 text-[11px] font-bold text-white`}>{tag}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-zinc-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-zinc-500">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-pink-600">
                  View Products <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="border-y border-zinc-100 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <SectionHeading eyebrow="Featured Products" title="Bestselling Bags" description="Top picks from our catalogue — ready for bulk ordering." />
            <Link href="/products" className="hidden items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700 sm:flex">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="overflow-hidden rounded-3xl bg-zinc-50 p-4">
                    <div className="aspect-square animate-pulse rounded-2xl bg-zinc-200" />
                    <div className="mt-4 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
                      <div className="h-3 w-full animate-pulse rounded bg-zinc-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="text-sm text-zinc-500">No products available.</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PRICING SLABS ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Bulk Pricing"
          title="Better Price as Your Order Grows"
          description="Structured per-kg pricing — the more you order, the less you pay per kg."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { qty: "200 KG",  label: "Starter",   desc: "Best for small retailers, kirana stores and first-time buyers.", highlight: false, badge: null },
            { qty: "500 KG",  label: "Business",  desc: "Most popular. Suitable for wholesale distributors and growing brands.", highlight: true,  badge: "Most Popular" },
            { qty: "1000 KG", label: "Enterprise", desc: "Best value for large distributors, chains and regular bulk buyers.", highlight: false, badge: "Best Value" },
          ].map(({ qty, label, desc, highlight, badge }) => (
            <div key={qty} className={`relative rounded-3xl p-6 ${highlight ? "bg-zinc-900 text-white shadow-xl ring-2 ring-pink-500" : "bg-white shadow-sm ring-1 ring-zinc-100"}`}>
              {badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pink-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                  {badge}
                </span>
              )}
              <p className={`text-xs font-bold uppercase tracking-widest ${highlight ? "text-pink-400" : "text-pink-500"}`}>{label}</p>
              <p className={`mt-2 text-3xl font-bold ${highlight ? "text-white" : "text-zinc-900"}`}>{qty}</p>
              <p className={`mt-1 text-sm ${highlight ? "text-zinc-400" : "text-zinc-400"}`}>Minimum order</p>
              <p className={`mt-4 text-sm leading-6 ${highlight ? "text-zinc-300" : "text-zinc-500"}`}>{desc}</p>
              <Link
                href="/contact"
                className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${highlight ? "bg-pink-500 text-white hover:bg-pink-400" : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}
              >
                Get Quote <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT + FACTORY ── */}
      <section className="border-y border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-3xl shadow-sm ring-1 ring-zinc-100">
              <div className="relative aspect-[4/3]">
                <Image src="/factory.png" alt="Manufacturing unit" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-2 backdrop-blur-sm">
                  <p className="text-xs font-semibold text-zinc-700">In-House Manufacturing · Roorkee, UK</p>
                </div>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="About Us"
                title="Manufacturer You Can Trust for Repeat Business"
                description="Econest Packaging is a Roorkee-based bag manufacturer supplying retailers, grocery chains, boutiques, sweet shops and distributors across India."
              />
              <div className="mt-8 space-y-4">
                {[
                  { icon: <Factory className="h-4 w-4 text-pink-500" />,  title: "Direct Factory Supply", desc: "No broker. You order directly from us — better price, faster turnaround." },
                  { icon: <Printer className="h-4 w-4 text-blue-500" />,  title: "Custom Logo Printing",   desc: "Single and multi-color logo printing on all bag styles and sizes." },
                  { icon: <Leaf className="h-4 w-4 text-green-500" />,    title: "Eco-Friendly Bags",      desc: "100% reusable, plastic-compliant non-woven fabric bags." },
                  { icon: <Award className="h-4 w-4 text-yellow-500" />,  title: "Quality Checked",        desc: "Every batch is inspected for GSM accuracy, stitching and finish." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-50 ring-1 ring-zinc-100">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-zinc-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link href="/about" className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700">
                  About Us
                </Link>
                <Link href="/products" className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50">
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading center eyebrow="Our Customers" title="Trusted by Businesses Across India" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { name: "Kirana Stores",     emoji: "🛒" },
            { name: "Grocery Chains",   emoji: "🥦" },
            { name: "Boutiques",         emoji: "👗" },
            { name: "Sweet Shops",       emoji: "🍬" },
            { name: "Gift Packaging",    emoji: "🎁" },
            { name: "Distributors",      emoji: "📦" },
          ].map(({ name, emoji }) => (
            <div key={name} className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white px-4 py-5 shadow-sm ring-1 ring-zinc-100">
              <span className="text-2xl">{emoji}</span>
              <span className="text-center text-xs font-semibold text-zinc-700">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="border-y border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading center eyebrow="Customer Reviews" title="What Our Buyers Say" />
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              { name: "Ramesh Agarwal", role: "Kirana Store, Kanpur", review: "Quality bags at very fair price. We order 500 kg every month. Printing also came out very nicely with our shop logo.", stars: 5 },
              { name: "Priya Boutique",  role: "Fashion Store, Lucknow", review: "Loop handle bags are perfect for our store. Customers love the quality. Delivery was on time and GST bill also provided.", stars: 5 },
              { name: "Suresh Traders",  role: "Wholesale Distributor, Delhi", review: "Been ordering for 2 years now. Consistent GSM quality, good pricing for 1000 kg orders and excellent WhatsApp support.", stars: 5 },
            ].map(({ name, role, review, stars }) => (
              <div key={name} className="rounded-3xl bg-zinc-50 p-6 ring-1 ring-zinc-100">
                <div className="flex gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-700">"{review}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{name}</p>
                    <p className="text-xs text-zinc-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP + FINAL CTA ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-zinc-900">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Left: CTA */}
            <div className="px-8 py-12">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-400">Get Started Today</p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Place a Bulk Order or Request a Custom Quote
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Call, WhatsApp or fill our contact form. We reply within the same day with pricing and availability.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                >
                  <Package className="h-4 w-4" /> Browse Products
                </Link>
                <a
                  href="https://wa.me/919389517814?text=Hello%2C%20I%20want%20to%20enquire%20about%20bulk%20bags"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-400"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
              {/* Contact info */}
              <div className="mt-8 space-y-2">
                <p className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> Call us: <span className="font-semibold text-white">+91 93895 17814</span>
                </p>
                <p className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> Email: <span className="font-semibold text-white">hello@econestpackaging.in</span>
                </p>
              </div>
            </div>

            {/* Right: Key specs */}
            <div className="flex flex-col justify-center gap-4 bg-white/5 px-8 py-12">
              {[
                { label: "MOQ",                 value: "200 KG onwards" },
                { label: "Pricing",             value: "Per KG — no per piece" },
                { label: "Shipping",            value: "₹8 per kg, pan India" },
                { label: "Custom Printing",     value: "Single & multi-color" },
                { label: "GST Invoice",         value: "Available on all orders" },
                { label: "Payment",             value: "Online / UPI / NEFT" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-zinc-400">{label}</span>
                  <span className="text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
