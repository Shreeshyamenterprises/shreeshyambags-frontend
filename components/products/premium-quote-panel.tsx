"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Variant } from "@/types";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useCartStore } from "@/store/cart-store";

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

function uniqueValues(
  items: Variant[],
  key: "size" | "color" | "shape" | "gsm",
) {
  return [...new Set(items.map((item) => String(item[key] ?? "")))].filter(
    Boolean,
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      {subtitle ? (
        <p className="mt-1 text-xs leading-5 text-zinc-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

function OptionChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm font-medium transition duration-200 ${
        active
          ? "border-pink-500 bg-pink-50 text-pink-600 shadow-sm"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}

export function PremiumQuotePanel({
  productTitle,
  variants,
}: {
  productTitle: string;
  variants: Variant[];
}) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const [qtyKg, setQtyKg] = useState<number>(200);
  const [printColors, setPrintColors] = useState<number>(1);
  const [customText, setCustomText] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const router = useRouter();
  const setCartCount = useCartStore((s) => s.setCount);
  const cartCount = useCartStore((s) => s.count);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedId) ?? variants[0] ?? null,
    [selectedId, variants],
  );

  const sizeOptions = uniqueValues(variants, "size");
  const colorOptions = uniqueValues(variants, "color");
  const shapeOptions = uniqueValues(variants, "shape");
  const gsmOptions = uniqueValues(variants, "gsm");

  function updateVariant(
    field: "size" | "color" | "shape" | "gsm",
    value: string,
  ) {
    if (!selectedVariant) return;

    const next = variants.find((v) => {
      const nextSize = field === "size" ? value : selectedVariant.size;
      const nextColor = field === "color" ? value : selectedVariant.color;
      const nextShape = field === "shape" ? value : selectedVariant.shape;
      const nextGsm =
        field === "gsm" ? value : String(selectedVariant.gsm ?? "");

      return (
        String(v.size) === String(nextSize) &&
        String(v.color) === String(nextColor) &&
        String(v.shape) === String(nextShape) &&
        String(v.gsm ?? "") === String(nextGsm)
      );
    });

    if (next) setSelectedId(next.id);
  }

  const appliedRate = useMemo(() => {
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
  }, [qtyKg, selectedVariant]);

  const gsm = selectedVariant?.gsm ?? 100;
  const { width, height, side } = parseSize(selectedVariant?.size ?? "");
  const approxBagWeightGrams =
    ((width * height + width * side + height * side) * gsm) / 100;

  const bagsPerKg =
    approxBagWeightGrams > 0
      ? Math.max(1, Math.floor(1000 / approxBagWeightGrams))
      : 0;

  const totalBags = bagsPerKg * qtyKg;
  const printCostPerBag =
    printColors === 1 ? 1.5 : printColors === 2 ? 2.5 : 3.5;

  const bagCost = qtyKg * appliedRate;
  const printingCost = totalBags * printCostPerBag;
  const totalCost = bagCost + printingCost;

  const whatsappMessage = selectedVariant
    ? `Hello, I want a quote for non-woven bags.

Product: ${productTitle}
Size: ${selectedVariant.size}
Color: ${selectedVariant.color}
Shape: ${selectedVariant.shape}
GSM: ${selectedVariant.gsm ?? "NA"}

Quantity: ${qtyKg} KG
Bags per KG: ${bagsPerKg}
Total Bags: ${totalBags}
Printing Colors: ${printColors}
Custom Text: ${customText || "NA"}

Rate: ₹${appliedRate}/kg
Bag Cost: ₹${bagCost}
Printing Cost: ₹${printingCost}
Estimated Total: ₹${totalCost}`
    : "";

  const whatsappUrl = `https://wa.me/919389517814?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  async function handleAddToCart() {
    if (!selectedVariant) return;
    if (!getToken()) {
      router.push("/login");
      return;
    }
    const qty = Math.floor(qtyKg);
    if (!qty || qty < 1) {
      toast.error("Please enter a valid quantity (minimum 1 KG).");
      return;
    }
    try {
      setAddingToCart(true);
      await api.post("/cart/items", {
        variantId: selectedVariant.id,
        customText: customText || undefined,
        quantity: qty,
      });
      setCartCount(cartCount + 1);
      toast.success("Added to cart!");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to add to cart. Please try again.";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setAddingToCart(false);
    }
  }

  if (!selectedVariant) {
    return (
      <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
        <p className="text-sm text-zinc-500">No variants available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_14px_50px_rgba(0,0,0,0.08)] ring-1 ring-zinc-100">
      <div className="border-b border-zinc-100 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 px-6 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-500">
          Instant Quote Studio
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
          Customize & Estimate
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
          Everything important is here — variant, GSM, quantity, printing and
          your estimated total.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/70">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
              Rate
            </p>
            <p className="mt-2 text-xl font-bold text-pink-600">
              ₹{appliedRate}/kg
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/70">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
              GSM
            </p>
            <p className="mt-2 text-xl font-bold text-zinc-900">
              {selectedVariant.gsm ?? "NA"}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/70">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
              Bags / KG
            </p>
            <p className="mt-2 text-xl font-bold text-zinc-900">{bagsPerKg}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-8">
        <div>
          <SectionTitle
            title="Select Size"
            subtitle="Choose the required bag dimension."
          />
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <OptionChip
                key={size}
                label={size}
                active={selectedVariant.size === size}
                onClick={() => updateVariant("size", size)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionTitle
            title="Select Color"
            subtitle="Pick the color most suitable for your business."
          />
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <OptionChip
                key={color}
                label={color}
                active={selectedVariant.color === color}
                onClick={() => updateVariant("color", color)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionTitle
            title="Select Shape"
            subtitle="Choose the bag style you want."
          />
          <div className="flex flex-wrap gap-2">
            {shapeOptions.map((shape) => (
              <OptionChip
                key={shape}
                label={shape}
                active={selectedVariant.shape === shape}
                onClick={() => updateVariant("shape", shape)}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionTitle
            title="Select GSM"
            subtitle="Higher GSM usually means better strength."
          />
          <div className="flex flex-wrap gap-2">
            {gsmOptions.map((gsmValue) => (
              <OptionChip
                key={gsmValue}
                label={`${gsmValue} GSM`}
                active={String(selectedVariant.gsm ?? "") === gsmValue}
                onClick={() => updateVariant("gsm", gsmValue)}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <SectionTitle title="Order Quantity" />
            <input
              type="number"
              min={1}
              value={qtyKg}
              onChange={(e) => setQtyKg(Number(e.target.value))}
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              placeholder="Enter quantity in KG"
            />
          </div>

          <div>
            <SectionTitle title="Printing Colors" />
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
        </div>

        <div>
          <SectionTitle
            title="Custom Printing Text"
            subtitle="Use only text here, for example your brand or shop name."
          />
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
            placeholder="Enter brand name / shop name / print text"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200">
          <div className="grid grid-cols-2 bg-zinc-50 text-sm font-semibold text-zinc-700">
            <div className="px-4 py-3">Bulk Quantity</div>
            <div className="px-4 py-3">Rate / KG</div>
          </div>

          {(selectedVariant.pricingTiers ?? []).length === 0 ? (
            <div className="px-4 py-3 text-sm text-zinc-500">
              No bulk slabs added yet.
            </div>
          ) : (
            selectedVariant.pricingTiers?.map((tier, index) => (
              <div
                key={tier.id ?? `${tier.minQtyKg}-${index}`}
                className={`grid grid-cols-2 border-t border-zinc-200 text-sm ${
                  qtyKg >= tier.minQtyKg ? "bg-pink-50/50" : ""
                }`}
              >
                <div className="px-4 py-3 text-zinc-700">
                  {tier.minQtyKg} KG
                </div>
                <div className="px-4 py-3 font-semibold text-zinc-900">
                  ₹{tier.pricePerKg}/kg
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl bg-zinc-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Weight / Bag</span>
              <span className="font-semibold text-zinc-900">
                {approxBagWeightGrams.toFixed(2)} g
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-zinc-500">Total Bags</span>
              <span className="font-semibold text-zinc-900">
                {totalBags.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200">
            <div className="grid grid-cols-2 bg-zinc-50 text-sm font-semibold text-zinc-700">
              <div className="px-4 py-3">Summary</div>
              <div className="px-4 py-3">Value</div>
            </div>

            <div className="grid grid-cols-2 border-t border-zinc-200 text-sm">
              <div className="px-4 py-3 text-zinc-600">Quantity</div>
              <div className="px-4 py-3 font-medium text-zinc-900">
                {qtyKg} KG
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
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {addingToCart ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {addingToCart ? "Adding…" : "Add to Cart"}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
        >
          Get Quote on WhatsApp
        </a>

        <p className="text-xs leading-5 text-zinc-500">
          Final quote may vary depending on exact dimensions, handle type, logo
          coverage and finishing.
        </p>
      </div>
    </div>
  );
}
