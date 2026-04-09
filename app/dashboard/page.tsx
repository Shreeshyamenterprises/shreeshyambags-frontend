"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  ClipboardList,
  ShoppingCart,
  Package,
  ChevronRight,
  MessageSquare,
  Layers,
  User,
  Pencil,
  Check,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  ArrowRight,
  Loader2,
  LogOut,
  Star,
  X,
  Shield,
  TrendingUp,
  BadgeCheck,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

type UserProfile = {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
};

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  productTitle?: string;
  variant?: { product?: { title?: string } };
};

type Order = {
  id: string;
  total: number;
  status?: string;
  createdAt?: string;
  items: OrderItem[];
};

type CartResponse = {
  items: { id: string; quantity: number }[];
  subtotal: number;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; ring: string; bg: string }> = {
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

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.CREATED;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-100 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 animate-pulse rounded-2xl bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-7 w-48 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[1,2,3,4].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/8" />)}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            <Skeleton className="h-72" />
            <Skeleton className="h-40" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-72" />
            <Skeleton className="h-28" />
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Edit Profile Drawer ─────────────────────────────────────────────────────────

function EditProfileDrawer({
  user,
  onSave,
  onClose,
}: {
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const e: { name?: string; phone?: string } = {};
    if (name.trim() && !/^[A-Za-z ]{2,50}$/.test(name.trim()))
      e.name = "Use letters and spaces only (2–50 characters).";
    if (phone.trim() && !/^[0-9]{10}$/.test(phone.trim()))
      e.phone = "Enter a valid 10-digit number.";
    return e;
  }

  async function handleSave() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    try {
      setSaving(true);
      const res = await api.patch("/auth/me", {
        ...(name.trim() && { name: name.trim() }),
        ...(phone.trim() && { phone: phone.trim() }),
      });
      onSave(res.data.user as UserProfile);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to update.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">

        {/* Drag handle (mobile) */}
        <div className="flex items-center justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-zinc-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 ring-1 ring-pink-100">
              <Pencil className="h-4 w-4 text-pink-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500">Account</p>
              <h3 className="text-base font-bold text-zinc-900">Edit Profile</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 pb-2">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Full Name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                placeholder="Your full name"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-300 ${
                  errors.name
                    ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
                    : "border-zinc-200 bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                }`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Phone Number</label>
            <div className={`flex overflow-hidden rounded-xl border bg-white transition focus-within:ring-2 ${
              errors.phone
                ? "border-red-300 focus-within:ring-red-100"
                : "border-zinc-200 focus-within:border-pink-400 focus-within:ring-pink-100"
            }`}>
              <span className="flex items-center border-r border-zinc-100 bg-zinc-50 px-3 text-xs font-bold text-zinc-500 select-none">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, phone: "" })); }}
                placeholder="10-digit mobile number"
                className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-zinc-300"
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-600">Email Address</label>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3.5 py-3 text-sm text-zinc-500">
              <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
              <span className="flex-1 truncate">{user.email}</span>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">Read only</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-8 pt-5 sm:pb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-60 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Profile Card ───────────────────────────────────────────────────────────────

function ProfileCard({
  user,
  initials,
  memberSince,
  onEdit,
}: {
  user: UserProfile;
  initials: string;
  memberSince: string | null;
  onEdit: () => void;
}) {
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">

      {/* Dark header with avatar */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-5 pb-6 pt-5">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-pink-500/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-4 left-1/3 h-20 w-20 rounded-full bg-fuchsia-500/10 blur-xl" />

        {/* Edit button */}
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1 ring-1 ring-white/10">
            <span className={`h-1.5 w-1.5 rounded-full ${isAdmin ? "bg-amber-400" : "bg-emerald-400"}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              {isAdmin ? "Admin" : "Member"}
            </span>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold text-zinc-300 backdrop-blur transition hover:bg-white/15 hover:text-white active:scale-95"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>

        {/* Avatar + name */}
        <div className="relative mt-4 flex flex-col items-center gap-2 text-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 text-2xl font-black text-white shadow-xl shadow-pink-900/40 ring-2 ring-white/10">
              {initials}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-zinc-800">
              <BadgeCheck className="h-3.5 w-3.5 text-white" />
            </span>
          </div>
          <div>
            <p className="mt-1 text-base font-bold text-white">{user.name ?? "No name set"}</p>
            <p className="text-xs text-zinc-400">{isAdmin ? "Administrator" : "Customer Account"}</p>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="divide-y divide-zinc-50 px-5 py-1">
        {/* Email */}
        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Mail className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email</p>
            <p className="truncate text-sm font-medium text-zinc-700">{user.email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <Phone className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Phone</p>
            {user.phone ? (
              <p className="text-sm font-medium text-zinc-700">+91 {user.phone}</p>
            ) : (
              <button
                onClick={onEdit}
                className="flex items-center gap-1 text-sm font-medium text-pink-500 transition hover:text-pink-600"
              >
                <Plus className="h-3.5 w-3.5" /> Add phone number
              </button>
            )}
          </div>
        </div>

        {/* Member since */}
        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50">
            <Calendar className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Member Since</p>
            <p className="text-sm font-medium text-zinc-700">{memberSince ?? "—"}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center gap-3 py-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <Shield className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Account Type</p>
            <p className="text-sm font-medium text-zinc-700">{isAdmin ? "Administrator" : "Customer"}</p>
          </div>
        </div>
      </div>

      {/* Membership badge */}
      <div className="mx-4 mb-4 mt-1 flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 px-4 py-3 shadow-sm shadow-amber-200">
        <Star className="h-4 w-4 shrink-0 text-amber-900/70" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-amber-900">Shreeshyam Member</p>
          <p className="truncate text-[10px] text-amber-800/80">Verified packaging customer</p>
        </div>
        <BadgeCheck className="h-4 w-4 shrink-0 text-amber-900/60" />
      </div>
    </div>
  );
}

// ── Main Content ───────────────────────────────────────────────────────────────

function DashboardContent() {
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [orders, setOrders]   = useState<Order[]>([]);
  const [cart, setCart]       = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const setCount = useCartStore((s) => s.setCount);
  const logout   = useAuthStore((s) => s.logout);
  const router   = useRouter();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [meRes, ordersRes, cartRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/orders/me"),
        api.get("/cart"),
      ]);
      setUser(meRes.data?.user ?? null);
      setOrders((ordersRes.data ?? []) as Order[]);
      const cartData = cartRes.data as CartResponse;
      setCart(cartData);
      setCount((cartData.items ?? []).length);
    } catch {
      toast.error("Failed to load account details.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const totalOrders    = orders.length;
  const cartItemsCount = useMemo(() => (cart?.items ?? []).length, [cart]);
  const totalSpent     = useMemo(() => orders.reduce((s, o) => s + (o.total ?? 0), 0), [orders]);
  const recentOrders   = orders.slice(0, 5);

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : (user?.email?.[0] ?? "U").toUpperCase();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  if (loading) return <DashboardSkeleton />;

  return (
    <main className="min-h-screen bg-[#f7f7fb]">

      {editOpen && user && (
        <EditProfileDrawer
          user={user}
          onSave={(updated) => { setUser(updated); setEditOpen(false); }}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-fuchsia-500/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Profile row */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 text-xl font-black text-white shadow-xl shadow-pink-900/40 ring-2 ring-white/10 sm:h-[72px] sm:w-[72px] sm:text-2xl">
                  {initials}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-zinc-900">
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
              </div>

              {/* Info */}
              <div>
                <p className="text-xs text-zinc-500">{greeting}</p>
                <h1 className="mt-0.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {user?.name ? user.name.split(" ")[0] : "My Account"}
                </h1>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                  {user?.email && (
                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                      <Mail className="h-3 w-3 shrink-0" />{user.email}
                    </span>
                  )}
                  {user?.phone && (
                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                      <Phone className="h-3 w-3 shrink-0" />+91 {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 active:scale-95"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Profile
              </button>
              <Link
                href="/products"
                className="flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:bg-pink-400 active:scale-95"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> Shop Now
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-white/8 px-3.5 py-2 text-sm font-semibold text-zinc-400 transition hover:border-red-400/30 hover:text-red-400 active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { label: "Total Orders",  value: String(totalOrders),               icon: ClipboardList, href: "/orders", accent: "text-blue-300"    },
              { label: "In Cart",       value: `${cartItemsCount} item${cartItemsCount !== 1 ? "s" : ""}`, icon: ShoppingCart, href: "/cart", accent: "text-pink-300" },
              { label: "Cart Value",    value: fmt(cart?.subtotal ?? 0),           icon: ShoppingBag,   href: "/cart",   accent: "text-violet-300" },
              { label: "Total Spent",   value: fmt(totalSpent),                    icon: TrendingUp,    href: null,      accent: "text-emerald-300" },
            ].map(({ label, value, icon: Icon, href, accent }) => {
              const inner = (
                <div className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white/6 px-4 py-3.5 ring-1 ring-white/8 transition ${href ? "hover:bg-white/10 hover:ring-white/15" : ""}`}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8">
                    <Icon className={`h-4 w-4 ${accent}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-medium text-zinc-500">{label}</p>
                    <p className="mt-0.5 truncate text-sm font-black text-white">{value}</p>
                  </div>
                  {href && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-600 transition group-hover:text-zinc-400" />}
                </div>
              );
              return href ? <Link key={label} href={href}>{inner}</Link> : <div key={label}>{inner}</div>;
            })}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

          {/* ── LEFT ── */}
          <div className="space-y-5">

            {/* Recent Orders */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500">History</p>
                  <h2 className="mt-0.5 text-base font-bold text-zinc-900">Recent Orders</h2>
                </div>
                {totalOrders > 0 && (
                  <Link
                    href="/orders"
                    className="flex items-center gap-1 rounded-xl bg-zinc-50 px-3.5 py-1.5 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200 transition hover:bg-zinc-100"
                  >
                    View all <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-14 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-fuchsia-50 ring-1 ring-pink-100">
                    <Package className="h-6 w-6 text-pink-300" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-800">No orders yet</p>
                    <p className="mt-1 text-xs text-zinc-400">Place your first bulk bag order today</p>
                  </div>
                  <Link href="/products" className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50">
                  {recentOrders.map((order) => {
                    const title = order.items?.[0]?.productTitle
                      || order.items?.[0]?.variant?.product?.title
                      || "Non-Woven Bag Order";
                    const itemCount = order.items?.length ?? 0;
                    const date = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Recent";

                    return (
                      <Link
                        key={order.id}
                        href="/orders"
                        className="flex items-center gap-4 px-5 py-4 transition hover:bg-zinc-50/70"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 ring-1 ring-pink-100">
                          <Package className="h-4 w-4 text-pink-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-zinc-900">{title}</p>
                          <p className="mt-0.5 text-xs text-zinc-400">
                            {itemCount} item{itemCount !== 1 ? "s" : ""} · {date}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <p className="text-sm font-bold text-zinc-900">{fmt(order.total)}</p>
                          <StatusPill status={order.status ?? "CREATED"} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {recentOrders.length > 0 && (
                <div className="border-t border-zinc-50 px-5 py-3.5">
                  <Link
                    href="/orders"
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-pink-500"
                  >
                    See all {totalOrders} orders <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <p className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-zinc-400">Quick Access</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: "/orders",   icon: ClipboardList, label: "My Orders",    desc: `${totalOrders} order${totalOrders !== 1 ? "s" : ""}`,                       iconBg: "bg-blue-50",    iconColor: "text-blue-500"    },
                  { href: "/cart",     icon: ShoppingCart,  label: "My Cart",      desc: `${cartItemsCount} item${cartItemsCount !== 1 ? "s" : ""} in cart`,          iconBg: "bg-pink-50",    iconColor: "text-pink-500"    },
                  { href: "/products", icon: Layers,        label: "Browse Bags",  desc: "Explore the catalog",                                                        iconBg: "bg-violet-50",  iconColor: "text-violet-500"  },
                  { href: "/contact",  icon: MessageSquare, label: "Bulk Enquiry", desc: "Custom print & large orders",                                                iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
                ].map(({ href, icon: Icon, label, desc, iconBg, iconColor }) => (
                  <Link
                    key={label}
                    href={href}
                    className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-zinc-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-zinc-900">{label}</p>
                      <p className="truncate text-xs text-zinc-400">{desc}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-300 transition group-hover:text-zinc-500" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="space-y-4">

            {/* Profile card */}
            <ProfileCard
              user={user!}
              initials={initials}
              memberSince={memberSince}
              onEdit={() => setEditOpen(true)}
            />

            {/* WhatsApp support */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#25d366] to-[#128c7e] p-5 shadow-md shadow-green-200">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Need Help?</p>
                  <p className="mt-0.5 text-xs leading-4 text-green-100">We reply within minutes — reach us directly on WhatsApp.</p>
                </div>
              </div>
              <a
                href="https://wa.me/919389517814?text=Hello%2C%20I%20need%20support%20with%20my%20order"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-sm font-bold text-green-700 shadow-sm transition hover:bg-green-50 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>

            {/* Shop CTA */}
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-pink-500/15 blur-xl" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-pink-400">Bulk Ordering</p>
              <h3 className="mt-2 text-base font-bold leading-snug text-white">Ready for your next order?</h3>
              <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                Custom bags, logo printing and wholesale pricing — all in one place.
              </p>
              <Link
                href="/products"
                className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-pink-500 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-900/30 transition hover:bg-pink-400 active:scale-[0.98]"
              >
                Browse Products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
