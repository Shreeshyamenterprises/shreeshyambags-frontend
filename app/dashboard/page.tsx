"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";

function DashboardContent() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/orders"
          className="rounded-2xl border p-6 transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">My Orders</h2>
          <p className="mt-2 text-sm text-zinc-500">View your order history</p>
        </Link>

        <Link
          href="/cart"
          className="rounded-2xl border p-6 transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">My Cart</h2>
          <p className="mt-2 text-sm text-zinc-500">View items in your cart</p>
        </Link>

        <Link
          href="/products"
          className="rounded-2xl border p-6 transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">Browse Products</h2>
          <p className="mt-2 text-sm text-zinc-500">Explore non woven bags</p>
        </Link>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
