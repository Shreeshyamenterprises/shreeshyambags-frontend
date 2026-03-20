"use client";

import { useState } from "react";
import { Variant } from "@/types";

export function BulkPriceCalculator({ variant }: { variant: Variant }) {
  const [qty, setQty] = useState<number>(200);

  if (!variant) return null;

  const tiers = variant.pricingTiers ?? [];

  let pricePerKg = variant.pricePerKg ?? 0;

  for (const tier of tiers) {
    if (qty >= tier.minQtyKg) {
      pricePerKg = tier.pricePerKg;
    }
  }

  const total = qty * pricePerKg;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
      <h3 className="text-lg font-semibold text-zinc-900">
        Bulk Order Calculator
      </h3>

      <p className="mt-1 text-sm text-zinc-500">
        Calculate estimated price based on order quantity.
      </p>

      {/* INPUT */}
      <div className="mt-5">
        <label className="text-sm font-medium text-zinc-700">
          Order Quantity (kg)
        </label>

        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm"
        />
      </div>

      {/* PRICE RESULT */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">Price per kg</span>
          <span className="font-semibold text-pink-600">₹{pricePerKg}/kg</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Total price</span>
          <span className="font-bold text-zinc-900">
            ₹{total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* NOTE */}
      <p className="mt-4 text-xs text-zinc-500">
        Final pricing may vary depending on printing, handle type, and custom
        branding.
      </p>
    </div>
  );
}
