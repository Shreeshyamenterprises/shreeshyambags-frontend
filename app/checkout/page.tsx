"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useCartStore } from "@/store/cart-store";

function CheckoutContent() {
  const router = useRouter();
  const reset = useCartStore((s) => s.reset);

  const [shipName, setShipName] = useState("");
  const [shipPhone, setShipPhone] = useState("");
  const [shipAddressLine1, setShipAddressLine1] = useState("");
  const [shipAddressLine2, setShipAddressLine2] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipState, setShipState] = useState("");
  const [shipPincode, setShipPincode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await api.post(
        "/orders",
        {
          shipName,
          shipPhone,
          shipAddressLine1,
          shipAddressLine2,
          shipCity,
          shipState,
          shipPincode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      reset();
      router.push(`/order-success?orderId=${res.data.id}`);
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-zinc-600">
          Enter shipping details to place your order.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <input
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
              value={shipName}
              onChange={(e) => setShipName(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Phone</label>
            <input
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
              value={shipPhone}
              onChange={(e) => setShipPhone(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Address Line 1
            </label>
            <input
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
              value={shipAddressLine1}
              onChange={(e) => setShipAddressLine1(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Address Line 2
            </label>
            <input
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
              value={shipAddressLine2}
              onChange={(e) => setShipAddressLine2(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">City</label>
            <input
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
              value={shipCity}
              onChange={(e) => setShipCity(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">State</label>
            <input
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
              value={shipState}
              onChange={(e) => setShipState(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Pincode</label>
            <input
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3"
              value={shipPincode}
              onChange={(e) => setShipPincode(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-zinc-900 px-6 py-3 text-white disabled:opacity-60"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}
