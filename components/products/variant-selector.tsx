"use client";

import { useState } from "react";
import { Variant } from "@/types";

export function VariantSelector({ variants }: { variants: Variant[] }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants[0] ?? null,
  );

  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color))];
  const shapes = [...new Set(variants.map((v) => v.shape))];

  function updateVariant(field: "size" | "color" | "shape", value: string) {
    const newVariant = variants.find((v) => {
      if (!selectedVariant) return false;

      return (
        (field === "size"
          ? v.size === value
          : v.size === selectedVariant.size) &&
        (field === "color"
          ? v.color === value
          : v.color === selectedVariant.color) &&
        (field === "shape"
          ? v.shape === value
          : v.shape === selectedVariant.shape)
      );
    });

    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  }

  if (!selectedVariant) {
    return <p className="text-sm text-zinc-500">No variants available.</p>;
  }

  return (
    <div className="space-y-6">
      {/* SIZE */}
      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-900">Size</p>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => updateVariant("size", size)}
              className={`rounded-xl border px-4 py-2 text-sm ${
                selectedVariant.size === size
                  ? "border-pink-500 bg-pink-50 text-pink-600"
                  : "border-zinc-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* COLOR */}
      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-900">Color</p>

        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => updateVariant("color", color)}
              className={`rounded-xl border px-4 py-2 text-sm ${
                selectedVariant.color === color
                  ? "border-pink-500 bg-pink-50 text-pink-600"
                  : "border-zinc-200"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* SHAPE */}
      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-900">Shape</p>

        <div className="flex flex-wrap gap-2">
          {shapes.map((shape) => (
            <button
              key={shape}
              onClick={() => updateVariant("shape", shape)}
              className={`rounded-xl border px-4 py-2 text-sm ${
                selectedVariant.shape === shape
                  ? "border-pink-500 bg-pink-50 text-pink-600"
                  : "border-zinc-200"
              }`}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>

      {/* GSM + PRICE */}
      <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-200">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">GSM</span>
          <span className="font-semibold">{selectedVariant.gsm ?? "NA"}</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span className="text-zinc-500">Price / Kg</span>
          <span className="font-semibold text-pink-600">
            ₹{selectedVariant.pricePerKg ?? "Ask"}
          </span>
        </div>
      </div>

      {/* BULK PRICING */}
      {selectedVariant.pricingTiers &&
        selectedVariant.pricingTiers.length > 0 && (
          <div className="rounded-xl border border-zinc-200">
            <div className="bg-zinc-50 px-4 py-3 text-sm font-semibold">
              Bulk Pricing
            </div>

            {selectedVariant.pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className="flex justify-between border-t px-4 py-3 text-sm"
              >
                <span>{tier.minQtyKg} kg</span>
                <span className="font-semibold">₹{tier.pricePerKg}/kg</span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
