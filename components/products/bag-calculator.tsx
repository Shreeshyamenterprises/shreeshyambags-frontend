"use client";

import { useState } from "react";
import { Variant } from "@/types";

export function BagCalculator({ variant }: { variant: Variant }) {
  const [qtyKg, setQtyKg] = useState(200);

  if (!variant?.gsm) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
        <p className="text-sm text-zinc-500">
          Bag calculator unavailable for this product.
        </p>
      </div>
    );
  }

  /*
  Approx formula used in bag industry:

  Weight per bag (grams) =
  (width * height * gsm) / 10000

  Since sizes vary a lot we assume
  average bag area multiplier.
  */

  const width = 13;
  const height = 12;

  const bagWeightGrams = ((width * height * variant.gsm) / 10000) * 1000;

  const bagsPerKg = Math.floor(1000 / bagWeightGrams);

  const totalBags = bagsPerKg * qtyKg;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
      <h3 className="text-lg font-semibold text-zinc-900">
        Bag Quantity Calculator
      </h3>

      <p className="mt-1 text-sm text-zinc-500">
        Estimate how many bags you get in a bulk order.
      </p>

      <div className="mt-5">
        <label className="text-sm font-medium text-zinc-700">
          Order Quantity (kg)
        </label>

        <input
          type="number"
          value={qtyKg}
          onChange={(e) => setQtyKg(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm"
        />
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">GSM</span>
          <span className="font-semibold">{variant.gsm}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Weight per bag</span>
          <span className="font-semibold">{bagWeightGrams.toFixed(2)} g</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Bags per kg</span>
          <span className="font-semibold">{bagsPerKg}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Total bags</span>
          <span className="font-bold text-pink-600">
            {totalBags.toLocaleString()}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Values are approximate and may vary depending on stitching, handles and
        finishing.
      </p>
    </div>
  );
}
