"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";

const hideOn = ["/login", "/signup", "/forgot-password", "/reset-password"];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const bagTypes = [
  { label: "D-Cut Non-Woven Bags", href: "/products" },
  { label: "W-Cut Carry Bags", href: "/products" },
  { label: "Loop Handle Bags", href: "/products" },
  { label: "Custom Printed Bags", href: "/products" },
  { label: "Bulk Business Orders", href: "/products" },
];

const badges = ["Custom Printing", "Bulk Orders", "Eco-Friendly", "Reusable", "Per KG Pricing"];

export function Footer() {
  const pathname = usePathname();
  if (hideOn.includes(pathname)) return null;

  return (
    <footer className="border-t border-zinc-200 bg-zinc-900 text-zinc-400">

      {/* Top strip */}
      <div className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-400">
            Need a bulk quote?{" "}
            <span className="font-semibold text-white">We reply the same day.</span>
          </p>
          <div className="flex gap-3">
            <a
              href="https://wa.me/919389517814"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-green-500 px-5 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp Us
            </a>
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              View Products
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-white">
              Shree Shyam
              <span className="ml-1 text-pink-400">Bags</span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Premium non-woven bags for shops, boutiques, gifting brands, grocery
              stores and bulk business orders. Reusable, customizable and brand-ready.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-pink-400"
                  >
                    <span className="h-px w-3 bg-zinc-700 transition group-hover:bg-pink-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">
              Our Products
            </h3>
            <ul className="space-y-3">
              {bagTypes.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-400 transition hover:text-pink-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919389517814"
                  className="flex items-start gap-3 text-sm transition hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
                  <span>+91 93895 17814</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:shreeshyamenterprise@gmail.com"
                  className="flex items-start gap-3 text-sm transition hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
                  <span>shreeshyamenterprise@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919389517814"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 text-sm transition hover:text-white"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Kanpur,Uttar+Pradesh,India"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 text-sm transition hover:text-white"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
                  <span>
                    Shree Shyam Enterprises<br />
                    Kanpur, Uttar Pradesh – 208001<br />
                    India
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-5 rounded-xl border border-zinc-700 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Business Hours</p>
              <p className="mt-1 text-sm text-zinc-300">Mon – Sat &nbsp;·&nbsp; 9 AM – 7 PM</p>
              <p className="mt-0.5 text-xs text-zinc-500">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Shree Shyam Enterprises. All rights reserved.</p>
          <p>Stylish packaging · Reusable utility · Everyday brand visibility</p>
        </div>
      </div>

    </footer>
  );
}
