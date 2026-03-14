"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useCartStore } from "@/store/cart-store";

type OrderItem = {
  id: string;
  quantity: number;
  variant: {
    product?: {
      title?: string;
    };
  };
};

type Order = {
  id: string;
  total: number;
  createdAt?: string;
  status?: string;
  items: OrderItem[];
};

type CartResponse = {
  items: {
    id: string;
    quantity: number;
  }[];
  subtotal: number;
};

function DashboardContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const setCount = useCartStore((s) => s.setCount);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) return;

      const [ordersRes, cartRes] = await Promise.all([
        api.get("/orders/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const ordersData = (ordersRes.data ?? []) as Order[];
      const cartData = cartRes.data as CartResponse;

      setOrders(ordersData);
      setCart(cartData);

      const count = (cartData.items ?? []).reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      setCount(count);
    } catch (error) {
      console.error(error);
      alert("Failed to load account details");
    } finally {
      setLoading(false);
    }
  }

  const totalOrders = orders.length;
  const cartItemsCount = useMemo(
    () => (cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );
  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total ?? 0), 0),
    [orders],
  );
  const recentOrders = orders.slice(0, 4);

  const customerName = "Valued Customer";
  const customerEmail = "Logged in user";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf7fb]">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            Loading account...
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100 shadow-sm ring-1 ring-pink-100">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-pink-600 shadow-sm ring-1 ring-pink-100 sm:h-24 sm:w-24 sm:text-3xl">
                {customerName.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                  My Account
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  Welcome back, {customerName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                  Manage your orders, cart and premium non-woven bag purchases
                  from one clean dashboard.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm ring-1 ring-white/70">
                    {customerEmail}
                  </div>
                  <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-pink-600 shadow-sm ring-1 ring-white/70">
                    Premium Non-Woven Buyer
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/orders"
                className="rounded-[1.75rem] bg-white/85 p-5 shadow-sm ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-zinc-900">My Orders</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Track your previous non-woven bag orders.
                </p>
              </Link>

              <Link
                href="/cart"
                className="rounded-[1.75rem] bg-white/85 p-5 shadow-sm ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-zinc-900">My Cart</p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Continue checkout from your saved cart items.
                </p>
              </Link>

              <Link
                href="/products"
                className="rounded-[1.75rem] bg-white/85 p-5 shadow-sm ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-zinc-900">
                  Browse Bags
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Explore GSM options, pricing and bulk order products.
                </p>
              </Link>

              <Link
                href="/contact"
                className="rounded-[1.75rem] bg-white/85 p-5 shadow-sm ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-zinc-900">
                  Bulk Enquiry
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Contact us for custom printing and large requirements.
                </p>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
              Total Orders
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">
              {totalOrders}
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
              Cart Items
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">
              {cartItemsCount}
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
              Cart Value
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">
              ₹{((cart?.subtotal ?? 0) / 100).toFixed(2)}
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
              Total Spent
            </p>
            <p className="mt-2 text-3xl font-bold text-pink-600">
              ₹{(totalSpent / 100).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
                  Recent Orders
                </p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-900">
                  Your order activity
                </h2>
              </div>

              <Link
                href="/orders"
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-500">
                You have not placed any orders yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-100"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                          Order ID
                        </p>
                        <p className="mt-1 font-semibold text-zinc-900">
                          {order.id}
                        </p>
                        <p className="mt-2 text-sm text-zinc-600">
                          {order.items?.[0]?.variant?.product?.title ||
                            "Non-Woven Bag Order"}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                          Total
                        </p>
                        <p className="mt-1 font-semibold text-pink-600">
                          ₹{(order.total / 100).toFixed(2)}
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "Recent"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
                Account Snapshot
              </p>
              <h2 className="mt-2 text-2xl font-bold text-zinc-900">
                Quick overview
              </h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                    Preferred Use
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">
                    Premium non-woven packaging
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                    Best Opportunity
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">
                    Bulk order with custom printing
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                    Current Cart
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-900">
                    {cartItemsCount} items waiting for checkout
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-zinc-900 p-6 text-white sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-300">
                Premium Packaging
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Your business deserves better bags
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Explore reusable, premium non-woven bags with GSM options,
                quantity pricing and custom printing for stronger brand recall.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex rounded-full bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
