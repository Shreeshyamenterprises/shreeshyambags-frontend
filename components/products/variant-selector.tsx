"use client";

import { useMemo, useState } from "react";
import { Variant } from "@/types";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useCartStore } from "@/store/cart-store";

export function VariantSelector({ variants }: { variants: Variant[] }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [loading, setLoading] = useState(false);
  const increment = useCartStore((s) => s.increment);

  const selected = useMemo(
    () => variants.find((v) => v.id === selectedId),
    [variants, selectedId],
  );

  function increaseQty() {
    setQuantity((prev) => prev + 1);
  }

  function decreaseQty() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  async function addToCart() {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) {
        alert("Please login first");
        return;
      }

      if (!selectedId) {
        alert("Please select a variant");
        return;
      }

      await api.post(
        "/cart/items",
        {
          variantId: selectedId,
          quantity,
          customText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      increment(quantity);
      alert("Added to cart");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  }

  if (!variants.length) {
    return (
      <p className="rounded-2xl bg-white p-4 text-sm text-zinc-500 shadow-sm ring-1 ring-zinc-100">
        No variants available.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
        <h3 className="text-lg font-semibold text-zinc-900">Select Variant</h3>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Bag Variant
            </label>
            <select
              className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.size} / {v.color} / {v.shape}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                  Size
                </p>
                <p className="mt-2 font-semibold text-zinc-900">
                  {selected.size}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                  Color
                </p>
                <p className="mt-2 font-semibold text-zinc-900">
                  {selected.color}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                  Shape
                </p>
                <p className="mt-2 font-semibold text-zinc-900">
                  {selected.shape}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Quantity
            </label>

            <div className="flex w-fit items-center rounded-full border border-zinc-300 bg-white">
              <button
                type="button"
                onClick={decreaseQty}
                className="px-4 py-2 text-lg font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                -
              </button>

              <div className="min-w-12 px-3 text-center text-sm font-semibold text-zinc-900">
                {quantity}
              </div>

              <button
                type="button"
                onClick={increaseQty}
                className="px-4 py-2 text-lg font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Custom Print Text
            </label>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              placeholder="Enter the text you want printed on the bag"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
            <p className="mt-2 text-xs text-zinc-500">
              Example: Shop name, brand line, event name, or contact details.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-zinc-900 p-5 text-white shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Selected Price
            </p>
            <p className="mt-2 text-3xl font-bold">
              ₹{selected ? (selected.price / 100).toFixed(2) : "0.00"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">
              Stock
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {selected?.stock ?? 0} available
            </p>
          </div>
        </div>

        <button
          onClick={addToCart}
          disabled={!selected || loading}
          className="mt-6 w-full rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
