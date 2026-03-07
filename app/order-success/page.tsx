"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white p-10 shadow-sm ring-1 ring-zinc-100">
        <h1 className="text-3xl font-bold">Order Placed Successfully 🎉</h1>
        <p className="mt-4 text-zinc-600">
          Thank you for your order. Your custom bag request has been received.
        </p>

        {orderId && (
          <p className="mt-4 text-sm text-zinc-500">
            Order ID: <span className="font-medium">{orderId}</span>
          </p>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/products"
            className="rounded-full bg-zinc-900 px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>

          <Link
            href="/cart"
            className="rounded-full border border-zinc-300 px-6 py-3"
          >
            View Cart
          </Link>
        </div>
      </div>
    </section>
  );
}
