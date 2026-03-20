"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag, Package, ArrowRight } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">

        {/* Success card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
          {/* Green top bar */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle2 className="h-9 w-9 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Order Placed!</h1>
            <p className="mt-1.5 text-sm text-green-100">
              Your custom bag request has been received.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            {orderId && (
              <div className="mb-6 rounded-xl bg-zinc-50 px-5 py-4 ring-1 ring-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Order ID</p>
                <p className="mt-1 font-mono text-sm font-semibold text-zinc-800 break-all">{orderId}</p>
              </div>
            )}

            <div className="space-y-3">
              {[
                { icon: <Package className="h-4 w-4 text-pink-400" />, text: "We have received your order and will process it shortly." },
                { icon: <CheckCircle2 className="h-4 w-4 text-green-400" />, text: "Our team will contact you to confirm printing details." },
                { icon: <ShoppingBag className="h-4 w-4 text-blue-400" />, text: "Shipping charges of ₹8/kg will be applied at dispatch." },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3 text-sm text-zinc-600">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                View My Orders
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Questions? Reach us on{" "}
          <a href="https://wa.me/919389517814" target="_blank" rel="noreferrer" className="font-semibold text-green-600 hover:underline">
            WhatsApp
          </a>
        </p>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
