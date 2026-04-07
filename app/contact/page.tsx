"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Clock,
  Package,
  Printer,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const contactReasons = [
  { icon: <Package className="h-4 w-4 text-pink-500" />, title: "Bulk Orders", desc: "Wholesale quantities, repeat orders, business supply." },
  { icon: <Printer className="h-4 w-4 text-blue-500" />, title: "Custom Printing", desc: "Logo, brand name, artwork on your bags." },
  { icon: <HelpCircle className="h-4 w-4 text-orange-500" />, title: "Bag Selection", desc: "Help choosing the right style, GSM and size." },
];

const contactDetails = [
  {
    icon: <Phone className="h-5 w-5 text-pink-500" />,
    label: "Phone / WhatsApp",
    value: "+91 93895 17814",
    href: "tel:+919389517814",
  },
  {
    icon: <MessageCircle className="h-5 w-5 text-green-500" />,
    label: "WhatsApp Chat",
    value: "Chat on WhatsApp",
    href: "https://wa.me/919389517814",
  },
  {
    icon: <Mail className="h-5 w-5 text-blue-500" />,
    label: "Email",
    value: "hello@econestpackaging.in",
    href: "mailto:hello@econestpackaging.in",
  },
  {
    icon: <MapPin className="h-5 w-5 text-red-400" />,
    label: "Location",
    value: "Roorkee, Uttarakhand, India",
    href: null,
  },
  {
    icon: <Clock className="h-5 w-5 text-purple-500" />,
    label: "Business Hours",
    value: "Mon – Sat, 9 AM – 7 PM",
    href: null,
  },
];

export default function ContactPage() {
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/quotes/contact", { name, phone, email, message });
      toast.success("Message sent! We'll get back to you shortly.");
      setName(""); setPhone(""); setEmail(""); setMessage("");
    } catch {
      // Fallback: open WhatsApp with pre-filled message
      const text = `Hello, I'm ${name}.\n\n${message}\n\nPhone: ${phone}${email ? `\nEmail: ${email}` : ""}`;
      window.open(`https://wa.me/919389517814?text=${encodeURIComponent(text)}`, "_blank");
      toast.success("Opening WhatsApp with your message.");
      setName(""); setPhone(""); setEmail(""); setMessage("");
    } finally {
      setLoading(false);
    }
  }

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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-500">Contact Us</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Let&apos;s Build the Right Bag Solution for Your Business
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
              Whether it&apos;s a bulk order, custom printing or just a question — reach out and
              we&apos;ll get back to you the same day.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {contactReasons.map(({ icon, title }) => (
                <div key={title} className="flex items-center gap-2.5 rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-zinc-200">
                  {icon}
                  <span className="text-xs font-semibold text-zinc-700">{title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: quick contact info */}
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: <Phone className="h-4 w-4 text-pink-500" />, label: "Phone / WhatsApp", value: "+91 93895 17814" },
              { icon: <Mail className="h-4 w-4 text-blue-500" />,  label: "Email", value: "hello@econestpackaging.in" },
              { icon: <Clock className="h-4 w-4 text-emerald-500" />, label: "Response Time", value: "Same day reply" },
              { icon: <MapPin className="h-4 w-4 text-orange-500" />, label: "Location", value: "Roorkee, Uttarakhand" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-zinc-200/60 backdrop-blur-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-50 ring-1 ring-zinc-100">
                  {icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
                  <p className="text-sm font-semibold text-zinc-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* ── Contact Form ── */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
            <div className="border-b border-zinc-100 px-7 py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">Send a Message</p>
              <h2 className="mt-1.5 text-xl font-bold text-zinc-900">We typically reply within a few hours</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-7 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-600">
                    Full Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-600">
                    Phone <span className="text-pink-500">*</span>
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    type="tel"
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="your@email.com (optional)"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-600">
                  Message <span className="text-pink-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Tell us about your bag requirements — type, quantity, size, printing needs…"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "Sending…" : "Send Message"}
              </button>

              <p className="text-center text-xs text-zinc-400">
                Or reach us directly on{" "}
                <a
                  href="https://wa.me/919389517814"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-green-600 hover:underline"
                >
                  WhatsApp
                </a>
              </p>
            </form>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-4 lg:sticky lg:top-20">

            {/* Contact details */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-5 py-4">
                <h3 className="text-sm font-bold text-zinc-900">Contact Details</h3>
              </div>
              <div className="divide-y divide-zinc-50 px-5">
                {contactDetails.map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3 py-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-50 ring-1 ring-zinc-100">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="mt-0.5 block truncate text-sm font-medium text-zinc-800 transition hover:text-pink-600"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-zinc-800">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What we help with */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-5 py-4">
                <h3 className="text-sm font-bold text-zinc-900">How We Can Help</h3>
              </div>
              <div className="divide-y divide-zinc-50 px-5">
                {contactReasons.map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 py-3.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 ring-1 ring-zinc-100">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-zinc-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp quick CTA */}
            <a
              href="https://wa.me/919389517814"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-green-500 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Chat Instantly on WhatsApp
            </a>

            <Link
              href="/products"
              className="block rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-center text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            >
              Browse Our Products →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
