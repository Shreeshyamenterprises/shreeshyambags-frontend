"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Variant } from "@/types";

export function BulkQuoteForm({
  productId,
  productTitle,
  variants,
}: {
  productId: string;
  productTitle: string;
  variants: Variant[];
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? "",
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [quantityKg, setQuantityKg] = useState<number>(200);
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? null,
    [variants, selectedVariantId],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/quotes", {
        productId,
        variantId: selectedVariant?.id || undefined,
        name,
        phone,
        email: email || undefined,
        quantityKg: Number(quantityKg),
        gsm: selectedVariant?.gsm ?? undefined,
        printing,
        message: message || undefined,
      });

      toast.success("Quote request sent successfully!");

      setName("");
      setPhone("");
      setEmail("");
      setQuantityKg(200);
      setPrinting(false);
      setMessage("");
      setSelectedVariantId(variants[0]?.id ?? "");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to send quote request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
          Bulk Quote
        </p>
        <h3 className="mt-2 text-2xl font-bold text-zinc-900">
          Request a custom quote
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Send your requirement for {productTitle} and get pricing for bulk
          quantity, GSM and custom printing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Variant
          </label>
          <div className="relative">
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.size} / {variant.color} / {variant.shape}
                  {variant.gsm ? ` / ${variant.gsm} GSM` : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Quantity (KG)
            </label>
            <input
              type="number"
              min={1}
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              placeholder="Enter quantity in KG"
              className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
              required
            />
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Custom Printing Required
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Enable this if you want logo or brand text printing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPrinting((prev) => !prev)}
              className={`relative h-7 w-12 rounded-full transition ${
                printing ? "bg-pink-500" : "bg-zinc-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  printing ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter order details, printing needs, delivery timing, etc."
            className="min-h-28 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Sending Request..." : "Request Bulk Quote"}
        </button>
      </form>
    </div>
  );
}
