"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Variant } from "@/types";

function parseSize(size: string) {
  const numbers = size.match(/\d+/g);

  if (!numbers) {
    return { width: 13, height: 12, side: 2 };
  }

  const height = Number(numbers[0] ?? 12);
  const width = Number(numbers[1] ?? 13);
  const side = Number(numbers[2] ?? 2);

  return { width, height, side };
}

export function BagCustomizer({
  productTitle,
  variants,
}: {
  productTitle: string;
  variants: Variant[];
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const [qtyKg, setQtyKg] = useState(200);
  const [printColors, setPrintColors] = useState(1);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedId) ?? null,
    [variants, selectedId],
  );

  const appliedPricePerKg = useMemo(() => {
    if (!selectedVariant) return 0;

    let rate = selectedVariant.pricePerKg ?? 0;
    const tiers = [...(selectedVariant.pricingTiers ?? [])].sort(
      (a, b) => a.minQtyKg - b.minQtyKg,
    );

    for (const tier of tiers) {
      if (qtyKg >= tier.minQtyKg) {
        rate = tier.pricePerKg;
      }
    }

    return rate;
  }, [selectedVariant, qtyKg]);

  if (!selectedVariant) return null;

  const gsm = selectedVariant.gsm ?? 100;
  const { width, height, side } = parseSize(selectedVariant.size);

  const approxBagWeightGrams =
    ((width * height + width * side + height * side) * gsm) / 100;

  const bagsPerKg =
    approxBagWeightGrams > 0
      ? Math.max(1, Math.floor(1000 / approxBagWeightGrams))
      : 0;

  const totalBags = bagsPerKg * qtyKg;

  const printCostPerBag =
    printColors === 1 ? 1.5 : printColors === 2 ? 2.5 : 3.5;

  const bagCost = qtyKg * appliedPricePerKg;
  const printingCost = totalBags * printCostPerBag;
  const totalCost = bagCost + printingCost;

  const whatsappMessage = `Hello, I want a quote for non-woven bags.

Product: ${productTitle}
Size: ${selectedVariant.size}
Color: ${selectedVariant.color}
Shape: ${selectedVariant.shape}
GSM: ${selectedVariant.gsm ?? "NA"}

Quantity: ${qtyKg} kg
Bags per kg: ${bagsPerKg}
Total bags: ${totalBags}

Rate: ₹${appliedPricePerKg}/kg
Bag Cost: ₹${bagCost}
Printing Colors: ${printColors}
Printing Cost: ₹${printingCost}

Estimated Total: ₹${totalCost}`;

  const whatsappUrl = `https://wa.me/919389517814?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
          Instant Quote
        </p>
        <h3 className="mt-2 text-2xl font-bold text-zinc-900">
          Customize Your Bag Order
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Select variant, order quantity and printing details to estimate your
          non-woven bag quote.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Variant
          </label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.size} / {variant.color} / {variant.shape}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Order Quantity (kg)
          </label>
          <input
            type="number"
            value={qtyKg}
            onChange={(e) => setQtyKg(Number(e.target.value))}
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Printing
          </label>
          <div className="relative">
            <select
              value={printColors}
              onChange={(e) => setPrintColors(Number(e.target.value))}
              className="w-full appearance-none cursor-pointer rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              <option value={1}>1 Color Print</option>
              <option value={2}>2 Color Print</option>
              <option value={3}>3+ Color Print</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            Selected GSM
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {selectedVariant.gsm ?? "NA"} GSM
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-sm text-zinc-500">Applied Rate</p>
          <p className="mt-1 text-2xl font-bold text-pink-600">
            ₹{appliedPricePerKg}/kg
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-sm text-zinc-500">Weight per Bag</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">
            {approxBagWeightGrams.toFixed(2)} g
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-sm text-zinc-500">Approx Bags per kg</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">{bagsPerKg}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
        <div className="grid grid-cols-2 bg-zinc-50 text-sm font-semibold text-zinc-700">
          <div className="px-4 py-3">Summary</div>
          <div className="px-4 py-3">Value</div>
        </div>

        <div className="grid grid-cols-2 border-t border-zinc-200 text-sm">
          <div className="px-4 py-3 text-zinc-600">Quantity</div>
          <div className="px-4 py-3 font-medium text-zinc-900">{qtyKg} kg</div>
        </div>

        <div className="grid grid-cols-2 border-t border-zinc-200 text-sm">
          <div className="px-4 py-3 text-zinc-600">Total Bags</div>
          <div className="px-4 py-3 font-medium text-zinc-900">
            {totalBags.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-zinc-200 text-sm">
          <div className="px-4 py-3 text-zinc-600">Bag Cost</div>
          <div className="px-4 py-3 font-medium text-zinc-900">
            ₹{bagCost.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-zinc-200 text-sm">
          <div className="px-4 py-3 text-zinc-600">Printing Cost</div>
          <div className="px-4 py-3 font-medium text-zinc-900">
            ₹{printingCost.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-zinc-200 bg-pink-50 text-sm">
          <div className="px-4 py-3 font-semibold text-zinc-900">
            Estimated Total
          </div>
          <div className="px-4 py-3 text-lg font-bold text-pink-600">
            ₹{totalCost.toLocaleString()}
          </div>
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
      >
        Get Quote on WhatsApp
      </a>

      <p className="mt-3 text-xs text-zinc-500">
        Final quote may vary depending on exact dimensions, handle type, logo
        coverage and finishing.
      </p>
    </div>
  );
}
