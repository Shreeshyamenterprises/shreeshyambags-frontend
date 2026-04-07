"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { CartResponse } from "@/types";
import { useCartStore } from "@/store/cart-store";

function CartContent() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const setCount = useCartStore((s) => s.setCount);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);

      const res = await api.get("/cart");

      const data = res.data as CartResponse;
      setCart(data);

      setCount((data.items ?? []).length);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(id: string) {
    try {
      await api.delete(`/cart/items/${id}`);

      await loadCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item.");
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          Loading cart...
        </div>
      </section>
    );
  }

  const items = cart?.items ?? [];

  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
            Your Cart
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Review your selected non-woven bags
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
            Check your bag variants, quantity and custom print text before
            placing the order.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
            <p className="text-zinc-600">Your cart is empty.</p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-full bg-pink-500 px-5 py-3 text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((item) => {
                const imageUrl = item.variant?.product?.images?.[0]?.url;
                const title = item.variant?.product?.title || "Non-Woven Bag";
                const slug = item.variant?.product?.slug;
                const href = slug ? `/products/${slug}` : "#";

                return (
                  <div
                    key={item.id}
                    className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100"
                  >
                    <div className="flex flex-col gap-4 md:flex-row">
                      <Link href={href} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 transition hover:opacity-90">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                            No Image
                          </div>
                        )}
                      </Link>

                      <div className="flex-1">
                        <Link href={href} className="hover:text-pink-600 transition">
                          <h2 className="text-lg font-semibold">{title}</h2>
                        </Link>

                        <p className="mt-1 text-sm text-zinc-600">
                          {item.variant?.size || "-"} /{" "}
                          {item.variant?.color || "-"} /{" "}
                          {item.variant?.shape || "-"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-600">
                          Qty: {item.quantity}
                        </p>

                        {item.customText && (
                          <p className="mt-2 text-sm text-zinc-700">
                            Custom Text:{" "}
                            <span className="font-medium">
                              {item.customText}
                            </span>
                          </p>
                        )}

                        <p className="mt-3 font-medium">
                          ₹{
                            item.variant?.pricePerKg != null
                              ? (item.variant.pricePerKg * item.quantity).toFixed(2)
                              : (((item.variant?.price ?? 0) * item.quantity) / 100).toFixed(2)
                          }
                        </p>
                      </div>

                      <div className="flex items-start">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-full border border-zinc-300 px-4 py-2 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
              <h2 className="text-xl font-semibold">Order Summary</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Subtotal</span>
                  <span>₹{((cart?.subtotal ?? 0) / 100).toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">
                    Shipping
                    {(cart?.totalKg ?? 0) > 0 && (
                      <span className="ml-1 text-xs text-zinc-400">({cart!.totalKg} kg × ₹8)</span>
                    )}
                  </span>
                  <span>₹{((cart?.shipping ?? 0) / 100).toFixed(2)}</span>
                </div>

                <div className="border-t border-zinc-200 pt-3 text-base font-semibold">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>₹{((cart?.total ?? 0) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-full bg-pink-500 px-6 py-3 text-center text-white"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function CartPage() {
  return (
    <AuthGuard>
      <CartContent />
    </AuthGuard>
  );
}
