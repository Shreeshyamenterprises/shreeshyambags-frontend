"use client";

import { useState } from "react";
import { Variant } from "@/types";

export function PrintingCalculator({ variant }: { variant: Variant }) {
  const [qty, setQty] = useState(200);
  const [colors, setColors] = useState(1);

  if (!variant?.pricePerKg) return null;

  const pricePerKg = variant.pricePerKg;

  // approx bags per kg calculation
  const gsm = variant.gsm ?? 100;
  const width = 13;
  const height = 12;

  const bagWeight = ((width * height * gsm) / 10000) * 1000;
  const bagsPerKg = Math.floor(1000 / bagWeight);

  const totalBags = bagsPerKg * qty;

  // printing cost per bag
  const printCostPerBag = colors === 1 ? 1.5 : colors === 2 ? 2.5 : 3.5;

  const bagCost = qty * pricePerKg;
  const printingCost = totalBags * printCostPerBag;

  const totalCost = bagCost + printingCost;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
      <h3 className="text-lg font-semibold text-zinc-900">
        Printing Cost Calculator
      </h3>

      <p className="mt-1 text-sm text-zinc-500">
        Estimate cost with custom logo printing.
      </p>

      {/* ORDER QTY */}
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

      {/* PRINT COLORS */}
      <div className="mt-4">
        <label className="text-sm font-medium text-zinc-700">
          Print Colors
        </label>

        <select
          value={colors}
          onChange={(e) => setColors(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm"
        >
          <option value={1}>1 Color</option>
          <option value={2}>2 Colors</option>
          <option value={3}>3+ Colors</option>
        </select>
      </div>

      {/* RESULTS */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-500">Total Bags</span>
          <span className="font-semibold">{totalBags}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Bag Cost</span>
          <span className="font-semibold">₹{bagCost.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-500">Printing Cost</span>
          <span className="font-semibold">
            ₹{printingCost.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-base">
          <span className="font-medium text-zinc-900">Total Cost</span>
          <span className="font-bold text-pink-600">
            ₹{totalCost.toLocaleString()}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Printing price may vary depending on logo size and ink coverage.
      </p>
    </div>
  );
}
