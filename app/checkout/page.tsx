"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import { CartResponse } from "@/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-zinc-600">
        {label} {required && <span className="text-pink-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
      />
    </div>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const reset = useCartStore((s) => s.reset);

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [cartLoading, setCartLoading] = useState(true);

  const [shipName, setShipName]               = useState("");
  const [shipPhone, setShipPhone]             = useState("");
  const [shipAddressLine1, setShipAddressLine1] = useState("");
  const [shipAddressLine2, setShipAddressLine2] = useState("");
  const [shipCity, setShipCity]               = useState("");
  const [shipState, setShipState]             = useState("");
  const [shipPincode, setShipPincode]         = useState("");
  const [loading, setLoading]                 = useState(false);

  useEffect(() => {
    api.get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => toast.error("Failed to load cart."))
      .finally(() => setCartLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await api.post("/orders", {
        shipName, shipPhone,
        shipAddressLine1, shipAddressLine2,
        shipCity, shipState, shipPincode,
      });

      const { orderId, razorpayOrderId, amount, keyId } = res.data;

      // If Razorpay is configured, open payment popup
      if (razorpayOrderId && keyId) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Payment gateway failed to load. Please try again.");
          return;
        }

        await new Promise<void>((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: keyId,
            amount,
            currency: "INR",
            order_id: razorpayOrderId,
            name: "Shree Shyam Bags",
            description: "Non-Woven Bag Order",
            handler: async (response: any) => {
              try {
                await api.post("/orders/verify", {
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                resolve();
              } catch {
                reject(new Error("Payment verification failed."));
              }
            },
            prefill: { name: shipName, contact: shipPhone },
            theme: { color: "#ec4899" },
            modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
          });
          rzp.open();
        });
      }

      reset();
      await api.delete("/cart").catch(() => {});
      toast.success("Order placed successfully!");
      router.push(`/order-success?orderId=${orderId}`);
    } catch (error: any) {
      toast.error(error?.message || error?.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  }

  const items    = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shipping = cart?.shipping ?? 0;
  const totalKg  = cart?.totalKg ?? 0;
  const total    = cart?.total ?? 0;

  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-2.5 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-800">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/cart" className="hover:text-zinc-800">Cart</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-zinc-800">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Checkout</h1>
          <p className="mt-1 text-sm text-zinc-500">Enter your shipping details to place the order.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">

          {/* Shipping Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-5 py-4">
                <h2 className="text-sm font-bold text-zinc-900">Shipping Address</h2>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <InputField label="Full Name" value={shipName} onChange={setShipName} placeholder="Your full name" required />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Phone Number" value={shipPhone} onChange={setShipPhone} placeholder="10-digit mobile number" type="tel" required />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Address Line 1" value={shipAddressLine1} onChange={setShipAddressLine1} placeholder="Street, building, area" required />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Address Line 2" value={shipAddressLine2} onChange={setShipAddressLine2} placeholder="Landmark, floor, suite (optional)" />
                </div>
                <InputField label="City" value={shipCity} onChange={setShipCity} placeholder="City" required />
                <InputField label="State" value={shipState} onChange={setShipState} placeholder="State" required />
                <InputField label="Pincode" value={shipPincode} onChange={setShipPincode} placeholder="6-digit pincode" required />
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <ShieldCheck className="h-4 w-4 text-green-500" />, label: "Secure Checkout" },
                { icon: <Truck className="h-4 w-4 text-blue-500" />, label: "Fast Dispatch" },
                { icon: <CreditCard className="h-4 w-4 text-pink-500" />, label: "Safe Payment" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-zinc-100">
                  {icon}
                  <span className="text-xs font-medium text-zinc-600">{label}</span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || cartLoading || items.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing Order…</> : "Place Order"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="border-b border-zinc-100 px-5 py-4">
                <h2 className="text-sm font-bold text-zinc-900">
                  Order Summary
                  <span className="ml-2 text-xs font-normal text-zinc-400">({items.length} item{items.length !== 1 ? "s" : ""})</span>
                </h2>
              </div>

              {cartLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
                </div>
              ) : items.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <p className="text-sm text-zinc-500">Your cart is empty.</p>
                  <Link href="/products" className="mt-3 inline-block text-xs font-semibold text-pink-500 hover:underline">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-semibold text-zinc-900">
                          {item.variant?.product?.title || "Non-Woven Bag"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          {item.variant?.size} · {item.variant?.color} · {item.variant?.shape}
                        </p>
                        {item.customText && (
                          <p className="mt-0.5 text-[11px] text-zinc-400">"{item.customText}"</p>
                        )}
                        <p className="mt-0.5 text-[11px] text-zinc-500">Qty: {item.quantity} KG</p>
                      </div>
                      <p className="shrink-0 text-xs font-semibold text-zinc-900">
                        ₹{
                          item.variant?.pricePerKg != null
                            ? (item.variant.pricePerKg * item.quantity).toFixed(0)
                            : (((item.variant?.price ?? 0) * item.quantity) / 100).toFixed(0)
                        }
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-zinc-100 px-5 py-4 space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Subtotal</span>
                  <span>₹{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>
                    Shipping
                    {totalKg > 0 && <span className="ml-1 text-zinc-400">({totalKg} kg × ₹8)</span>}
                  </span>
                  <span>₹{(shipping / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-100 pt-2 text-sm font-bold text-zinc-900">
                  <span>Total</span>
                  <span>₹{(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link href="/cart" className="block text-center text-xs text-zinc-400 hover:text-zinc-600 transition">
              ← Edit Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}
