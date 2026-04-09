"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect, useMemo, useState } from "react";
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
  CreditCard,
  ClipboardList,
  ArrowRight,
  MapPin,
  Phone,
  TrendingUp,
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

// ── Timeline ──────────────────────────────────────────────────────────────────

const TIMELINE_STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "CREATED",   label: "Placed",   icon: <Package className="h-3.5 w-3.5" /> },
  { status: "PAID",      label: "Paid",     icon: <CreditCard className="h-3.5 w-3.5" /> },
  { status: "SHIPPED",   label: "Shipped",  icon: <Truck className="h-3.5 w-3.5" /> },
  { status: "DELIVERED", label: "Delivered",icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  CREATED: 0, PAID: 1, SHIPPED: 2, DELIVERED: 3,
  FAILED: -1, CANCELLED: -1,
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; dot: string; text: string; ring: string; bg: string }> = {
  CREATED:   { label: "Order Placed",   dot: "bg-amber-400",   text: "text-amber-700",   ring: "ring-amber-200",   bg: "bg-amber-50"   },
  PAID:      { label: "Paid",           dot: "bg-blue-400",    text: "text-blue-700",    ring: "ring-blue-200",    bg: "bg-blue-50"    },
  SHIPPED:   { label: "Shipped",        dot: "bg-violet-400",  text: "text-violet-700",  ring: "ring-violet-200",  bg: "bg-violet-50"  },
  DELIVERED: { label: "Delivered",      dot: "bg-emerald-500", text: "text-emerald-700", ring: "ring-emerald-200", bg: "bg-emerald-50" },
  CANCELLED: { label: "Cancelled",      dot: "bg-red-400",     text: "text-red-600",     ring: "ring-red-200",     bg: "bg-red-50"     },
  FAILED:    { label: "Payment Failed", dot: "bg-red-400",     text: "text-red-600",     ring: "ring-red-200",     bg: "bg-red-50"     },
};

function fmt(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function StatusPill({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.CREATED;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentIdx = STATUS_ORDER[status];
  if (currentIdx < 0) {
    return (
      <div className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold ${
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
    <div className="flex items-center">
      {TIMELINE_STEPS.map((step, idx) => {
        const done   = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.status} className="flex items-center">
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
            {idx < TIMELINE_STEPS.length - 1 && (
              <div className={`mb-4 h-0.5 w-8 sm:w-14 ${done ? "bg-emerald-400" : "bg-zinc-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
      <div className="border-b border-zinc-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 animate-pulse rounded-xl bg-zinc-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
        </div>
      </div>
      <div className="space-y-3 px-5 py-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-zinc-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── OrderCard ─────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:shadow-md">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pink-50 ring-1 ring-pink-100">
            <Package className="h-4.5 w-4.5 text-pink-500" />
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold text-zinc-400 tracking-wider">
              #{order.id.slice(-10).toUpperCase()}
            </p>
            <p className="text-xs text-zinc-500">{date}</p>
          </div>
          <StatusPill status={order.status} />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total</p>
            <p className="text-base font-black text-zinc-900">{fmt(order.total)}</p>
          </div>
          <button
            onClick={() => setExpanded((p) => !p)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              expanded
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {expanded ? "Close" : "Details"}
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="overflow-x-auto border-b border-zinc-50 px-5 py-4">
        <StatusTimeline status={order.status} />
      </div>

      {/* ── Items ── */}
      <div className="divide-y divide-zinc-50 px-5">
        {order.items.map((item) => {
          const imageUrl = item.variant?.product?.images?.[0]?.url;
          return (
            <div key={item.id} className="flex items-center gap-4 py-3.5">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-zinc-100">
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
                  {item.customText && (
                    <span className="ml-2 italic text-zinc-500">"{item.customText}"</span>
                  )}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-zinc-900">{fmt(item.unitPrice)}</p>
                <p className="text-xs text-zinc-400">{item.quantity} KG</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Cost breakdown */}
            <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-100">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cost Breakdown</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-700">{fmt(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span className="font-medium text-zinc-700">{fmt(order.shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-100 pt-2 font-bold text-zinc-900">
                  <span>Total</span>
                  <span>{fmt(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="rounded-2xl bg-white p-4 ring-1 ring-zinc-100">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Shipping Address</p>
              <div className="space-y-1.5 text-sm text-zinc-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <p className="font-semibold text-zinc-900">{order.shipName}</p>
                </div>
                <p className="pl-5 text-xs leading-5 text-zinc-500">
                  {order.shipAddressLine1}
                  {order.shipAddressLine2 && <>, {order.shipAddressLine2}</>}
                  <br />{order.shipCity}, {order.shipState} – {order.shipPincode}
                </p>
                <div className="flex items-center gap-2 pl-0.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <p className="text-xs text-zinc-500">{order.shipPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/me")
      .then((res) => setOrders(res.data ?? []))
      .catch(() => toast.error("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent    = useMemo(() => orders.reduce((s, o) => s + (o.total ?? 0), 0), [orders]);
  const deliveredCount = useMemo(() => orders.filter(o => o.status === "DELIVERED").length, [orders]);
  const pendingCount   = useMemo(() => orders.filter(o => o.status === "CREATED" || o.status === "PAID" || o.status === "SHIPPED").length, [orders]);

  return (
    <main className="min-h-screen bg-[#f7f7fb]">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-violet-500/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-[11px] text-zinc-500">
            <Link href="/dashboard" className="transition hover:text-zinc-300">Account</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-300 font-medium">My Orders</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 ring-1 ring-white/10">
                <ClipboardList className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-pink-400">Order History</p>
                <h1 className="mt-0.5 text-2xl font-black tracking-tight text-white sm:text-3xl">My Orders</h1>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {loading ? "Loading…" : `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-pink-500/25 transition hover:bg-pink-400 active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" /> Shop More
            </Link>
          </div>

          {/* Stats strip */}
          {!loading && (
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { label: "Total Orders",  value: String(orders.length),   icon: ClipboardList, accent: "text-blue-300"    },
                { label: "In Progress",   value: String(pendingCount),     icon: Clock,         accent: "text-amber-300"  },
                { label: "Delivered",     value: String(deliveredCount),   icon: CheckCircle2,  accent: "text-emerald-300"},
                { label: "Total Spent",   value: fmt(totalSpent),          icon: TrendingUp,    accent: "text-pink-300"   },
              ].map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="flex items-center gap-3 overflow-hidden rounded-2xl bg-white/6 px-4 py-3.5 ring-1 ring-white/8">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8">
                    <Icon className={`h-4 w-4 ${accent}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-medium text-zinc-500">{label}</p>
                    <p className="mt-0.5 truncate text-sm font-black text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-20 text-center shadow-sm ring-1 ring-zinc-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-fuchsia-50 ring-1 ring-pink-100">
              <ShoppingBag className="h-8 w-8 text-pink-300" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-zinc-900">No orders yet</h2>
            <p className="mt-1.5 text-sm text-zinc-500">You haven&apos;t placed any orders. Start by browsing our non-woven bags.</p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              Browse Products <ArrowRight className="h-4 w-4" />
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
