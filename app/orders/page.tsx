"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  IndianRupee,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

type OrderStatus = "CREATED" | "PAID" | "FAILED" | "CANCELLED" | "SHIPPED" | "DELIVERED";

type OrderItem = {
  id: string;
  productTitle: string;
  size: string;
  color: string;
  shape: string;
  quantity: number;
  unitPrice: number;
  customText?: string;
  variant?: {
    product?: {
      images?: { url: string }[];
    };
  };
};

type Order = {
  id: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  shipName: string;
  shipPhone: string;
  shipAddressLine1: string;
  shipAddressLine2?: string;
  shipCity: string;
  shipState: string;
  shipPincode: string;
  items: OrderItem[];
};

// Timeline steps for active orders
const TIMELINE_STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "CREATED",   label: "Order Placed", icon: <Package className="h-3.5 w-3.5" /> },
  { status: "PAID",      label: "Payment",      icon: <CreditCard className="h-3.5 w-3.5" /> },
  { status: "SHIPPED",   label: "Shipped",      icon: <Truck className="h-3.5 w-3.5" /> },
  { status: "DELIVERED", label: "Delivered",    icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  CREATED: 0, PAID: 1, SHIPPED: 2, DELIVERED: 3,
  FAILED: -1, CANCELLED: -1,
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ReactNode; style: string }> = {
  CREATED:   { label: "Order Placed",   icon: <Clock className="h-3.5 w-3.5" />,        style: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200" },
  PAID:      { label: "Paid",           icon: <CheckCircle2 className="h-3.5 w-3.5" />, style: "bg-green-50 text-green-700 ring-1 ring-green-200" },
  SHIPPED:   { label: "Shipped",        icon: <Truck className="h-3.5 w-3.5" />,        style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  DELIVERED: { label: "Delivered",      icon: <CheckCircle2 className="h-3.5 w-3.5" />, style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  CANCELLED: { label: "Cancelled",      icon: <XCircle className="h-3.5 w-3.5" />,      style: "bg-red-50 text-red-700 ring-1 ring-red-200" },
  FAILED:    { label: "Payment Failed", icon: <AlertCircle className="h-3.5 w-3.5" />,  style: "bg-red-50 text-red-600 ring-1 ring-red-200" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.CREATED;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.style}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentIdx = STATUS_ORDER[status];
  // Only show for active order flow (not FAILED/CANCELLED)
  if (currentIdx < 0) {
    return (
      <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold ${
        status === "CANCELLED"
          ? "bg-red-50 text-red-600 ring-1 ring-red-100"
          : "bg-orange-50 text-orange-600 ring-1 ring-orange-100"
      }`}>
        {status === "CANCELLED" ? <XCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
        {status === "CANCELLED" ? "Order was cancelled" : "Payment failed — please contact support"}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0">
      {TIMELINE_STEPS.map((step, idx) => {
        const done   = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.status} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                done    ? "bg-emerald-500 text-white shadow-sm" :
                active  ? "bg-pink-500 text-white shadow-md ring-2 ring-pink-200" :
                          "bg-zinc-100 text-zinc-400"
              }`}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.icon}
              </div>
              <span className={`mt-1 whitespace-nowrap text-[10px] font-semibold ${
                done ? "text-emerald-600" : active ? "text-pink-600" : "text-zinc-400"
              }`}>
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {idx < TIMELINE_STEPS.length - 1 && (
              <div className={`mb-4 h-0.5 w-10 sm:w-16 ${done ? "bg-emerald-400" : "bg-zinc-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
      <div className="border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
        </div>
      </div>
      <div className="space-y-3 px-6 py-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-48 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-16 animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:shadow-md">
      {/* Header row */}
      <div className="flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 ring-1 ring-pink-100">
            <Package className="h-4 w-4 text-pink-500" />
          </div>
          <div>
            <p className="font-mono text-xs text-zinc-400">#{order.id.slice(-10).toUpperCase()}</p>
            <p className="text-xs text-zinc-500">{date}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total</p>
            <p className="flex items-center gap-0.5 text-base font-bold text-zinc-900">
              <IndianRupee className="h-3.5 w-3.5" />
              {(order.total / 100).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50"
          >
            {expanded ? "Hide" : "Details"}
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      {/* Status timeline */}
      <div className="overflow-x-auto border-b border-zinc-50 px-5 py-4">
        <StatusTimeline status={order.status} />
      </div>

      {/* Items */}
      <div className="divide-y divide-zinc-50 px-5">
        {order.items.map((item) => {
          const imageUrl = item.variant?.product?.images?.[0]?.url;
          return (
            <div key={item.id} className="flex items-center gap-4 py-3">
              {/* Product image */}
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-50 ring-1 ring-zinc-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.productTitle}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-5 w-5 text-zinc-300" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900">{item.productTitle}</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {item.size} · {item.color} · {item.shape}
                  {item.customText && <span className="ml-2 italic">"{item.customText}"</span>}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-zinc-900">
                  ₹{(item.unitPrice / 100).toFixed(2)}
                  <span className="ml-1 text-xs font-normal text-zinc-400">/kg</span>
                </p>
                <p className="text-xs text-zinc-400">{item.quantity} KG</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded: cost breakdown + shipping address */}
      {expanded && (
        <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-4">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Cost breakdown */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Cost Breakdown</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span>₹{(order.shipping / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-1.5 font-bold text-zinc-900">
                  <span>Total</span>
                  <span>₹{(order.total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Shipping Address</p>
              <div className="text-sm leading-6 text-zinc-600">
                <p className="font-semibold text-zinc-900">{order.shipName}</p>
                <p>{order.shipAddressLine1}</p>
                {order.shipAddressLine2 && <p>{order.shipAddressLine2}</p>}
                <p>{order.shipCity}, {order.shipState} – {order.shipPincode}</p>
                <p>{order.shipPhone}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/me")
      .then((res) => setOrders(res.data ?? []))
      .catch(() => toast.error("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="mb-1 flex items-center gap-1 text-xs text-zinc-400">
            <Link href="/" className="hover:text-zinc-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-700 font-medium">My Orders</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">My Orders</h1>
              <p className="text-sm text-zinc-500">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50"
            >
              <ShoppingBag className="h-4 w-4" /> Shop More
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm ring-1 ring-zinc-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100">
              <ShoppingBag className="h-8 w-8 text-zinc-300" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-zinc-900">No orders yet</h2>
            <p className="mt-1.5 text-sm text-zinc-500">You haven&apos;t placed any orders. Start by browsing our bags.</p>
            <Link
              href="/products"
              className="mt-6 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </main>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
