"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  ClipboardList,
  ShoppingCart,
  IndianRupee,
  Package,
  ChevronRight,
  MessageSquare,
  Layers,
  User,
  Pencil,
  X,
  Check,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  ArrowRight,
  Loader2,
  LogOut,
  MapPin,
  Star,
} from "lucide-react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth"; // still needed for EditProfilePanel
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  CREATED:   { label: "Order Placed",   style: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200" },
  PAID:      { label: "Paid",           style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  SHIPPED:   { label: "Shipped",        style: "bg-purple-50 text-purple-700 ring-1 ring-purple-200" },
  DELIVERED: { label: "Delivered",      style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  CANCELLED: { label: "Cancelled",      style: "bg-red-50 text-red-600 ring-1 ring-red-200" },
  FAILED:    { label: "Payment Failed", style: "bg-red-50 text-red-600 ring-1 ring-red-200" },
};

function fmt(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-100 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      <SkeletonBlock className="h-52 rounded-none" />
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map(i => <SkeletonBlock key={i} className="h-24" />)}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <SkeletonBlock className="h-96" />
          <div className="space-y-4">
            <SkeletonBlock className="h-56" />
            <SkeletonBlock className="h-32" />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ── Edit Profile Panel ── */
function EditProfilePanel({
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
    if (name && !/^[A-Za-z ]{2,50}$/.test(name.trim()))
      e.name = "Use only letters and spaces (2–50 chars).";
    if (phone && !/^[0-9]{10}$/.test(phone.trim()))
      e.phone = "Phone must be exactly 10 digits.";
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
      toast.success("Profile updated!");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to update.");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = (err?: string) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 ${
      err
        ? "border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-zinc-200 bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
    }`;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-pink-500">Edit Profile</p>
          <h3 className="mt-0.5 text-base font-bold text-zinc-900">Update your details</h3>
        </div>
        <button onClick={onClose} className="rounded-full p-1.5 hover:bg-zinc-100">
          <X className="h-4 w-4 text-zinc-500" />
        </button>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-600">Full Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
              placeholder="Your full name"
              className={`${inputCls(errors.name)} pl-10`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-600">Phone Number</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 select-none border-r border-zinc-200 pr-2.5 text-xs font-semibold text-zinc-500">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, phone: "" })); }}
              placeholder="10 digit number"
              className={`${inputCls(errors.phone)} pl-[4.25rem]`}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-600">Email</label>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-500">
            {user.email}
            <span className="ml-auto rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">Read only</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-zinc-100 px-6 py-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button onClick={onClose} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── Main content ── */
function DashboardContent() {
  const [user, setUser]     = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart]     = useState<CartResponse | null>(null);
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

  if (loading) return <DashboardSkeleton />;

  return (
    <main className="min-h-screen bg-[#f7f7fb]">

      {/* ── Profile Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-10"
          style={{ background: "radial-gradient(circle at 80% 50%, #ec4899 0%, transparent 60%)" }} />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Avatar + info */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-fuchsia-500 text-xl font-bold text-white shadow-lg sm:h-20 sm:w-20 sm:text-2xl">
                  {initials}
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-400 ring-2 ring-zinc-900">
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-400">My Account</p>
                  <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-semibold text-pink-300 ring-1 ring-pink-500/30">
                    {user?.role === "ADMIN" ? "Admin" : "Customer"}
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-bold text-white">
                  {user?.name ? `${user.name.split(" ")[0]}` : "My Account"}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {user?.email && (
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Mail className="h-3 w-3" />{user.email}
                    </span>
                  )}
                  {user?.phone && (
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Phone className="h-3 w-3" />+91 {user.phone}
                    </span>
                  )}
                  {memberSince && (
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Calendar className="h-3 w-3" />Member since {memberSince}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </button>
              <Link
                href="/products"
                className="flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600"
              >
                <ShoppingBag className="h-4 w-4" /> Shop Now
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:border-red-400/30 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>

          {/* Mini stats inside banner */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Orders",  value: String(totalOrders), icon: ClipboardList, href: "/orders" },
              { label: "Cart Items",    value: String(cartItemsCount), icon: ShoppingCart, href: "/cart" },
              { label: "Cart Value",    value: fmt(cart?.subtotal ?? 0), icon: ShoppingBag, href: "/cart" },
              { label: "Total Spent",   value: fmt(totalSpent), icon: IndianRupee, href: null },
            ].map(({ label, value, icon: Icon, href }) => {
              const inner = (
                <div className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/12">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-4 w-4 text-pink-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs text-zinc-400">{label}</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-white">{value}</p>
                  </div>
                  {href && <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-zinc-600" />}
                </div>
              );
              return href ? <Link key={label} href={href}>{inner}</Link> : <div key={label}>{inner}</div>;
            })}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* ── LEFT: Recent Orders ── */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-pink-500">Order History</p>
                  <h2 className="mt-0.5 text-lg font-bold text-zinc-900">Recent Orders</h2>
                </div>
                <Link href="/orders" className="flex items-center gap-1 rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50">
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100">
                    <Package className="h-7 w-7 text-zinc-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-700">No orders yet</p>
                    <p className="mt-1 text-xs text-zinc-400">Place your first bulk bag order today</p>
                  </div>
                  <Link href="/products" className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50">
                  {recentOrders.map((order) => {
                    const title = order.items?.[0]?.productTitle || order.items?.[0]?.variant?.product?.title || "Non-Woven Bag Order";
                    const cfg   = STATUS_CONFIG[order.status ?? ""] ?? STATUS_CONFIG.CREATED;
                    const itemCount = order.items?.length ?? 0;
                    return (
                      <div key={order.id} className="flex items-center gap-4 px-6 py-4 transition hover:bg-zinc-50/50">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 ring-1 ring-pink-100">
                          <Package className="h-5 w-5 text-pink-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-zinc-900">{title}</p>
                          <p className="mt-0.5 text-xs text-zinc-400">
                            {itemCount} item{itemCount !== 1 ? "s" : ""} ·{" "}
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                              : "Recent"}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <p className="text-sm font-bold text-zinc-900">{fmt(order.total)}</p>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cfg.style}`}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {recentOrders.length > 0 && (
                <div className="border-t border-zinc-100 px-6 py-4">
                  <Link href="/orders" className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-pink-600">
                    See all {totalOrders} orders <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Quick actions row */}
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/orders",   icon: ClipboardList, label: "My Orders",     desc: "Track all your orders",         color: "bg-blue-50 text-blue-500" },
                { href: "/cart",     icon: ShoppingCart,  label: "My Cart",       desc: `${cartItemsCount} item${cartItemsCount !== 1 ? "s" : ""} in cart`, color: "bg-pink-50 text-pink-500" },
                { href: "/products", icon: Layers,        label: "Browse Bags",   desc: "Explore bulk pricing",          color: "bg-purple-50 text-purple-500" },
                { href: "/contact",  icon: MessageSquare, label: "Bulk Enquiry",  desc: "Custom printing & large orders", color: "bg-emerald-50 text-emerald-500" },
              ].map(({ href, icon: Icon, label, desc, color }) => (
                <Link key={label} href={href} className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900">{label}</p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-zinc-300 transition group-hover:text-zinc-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Profile + Support ── */}
          <div className="space-y-5">

            {/* Edit profile panel (slide in) */}
            {editOpen && user ? (
              <EditProfilePanel
                user={user}
                onSave={(updated) => { setUser(updated); setEditOpen(false); }}
                onClose={() => setEditOpen(false)}
              />
            ) : (
              /* Profile card */
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
                <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                  <p className="text-sm font-bold text-zinc-900">Profile Details</p>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-4 px-5 py-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-fuchsia-500 text-lg font-bold text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{user?.name ?? "—"}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{user?.role === "ADMIN" ? "Administrator" : "Customer Account"}</p>
                    {memberSince && <p className="mt-0.5 text-xs text-zinc-400">Since {memberSince}</p>}
                  </div>
                </div>

                <div className="divide-y divide-zinc-50 px-5 pb-5">
                  {[
                    { icon: <Mail className="h-4 w-4 text-zinc-400" />,     label: "Email",    value: user?.email },
                    { icon: <Phone className="h-4 w-4 text-zinc-400" />,    label: "Phone",    value: user?.phone ? `+91 ${user.phone}` : "Not added" },
                    { icon: <MapPin className="h-4 w-4 text-zinc-400" />,   label: "Location", value: "India" },
                    { icon: <Star className="h-4 w-4 text-yellow-400" />,   label: "Member",   value: "Econest Packaging Member" },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 ring-1 ring-zinc-100">
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
                        <p className="truncate text-sm font-medium text-zinc-700">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp support card */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Need Help?</p>
                  <p className="text-xs text-green-100">We reply within minutes on WhatsApp</p>
                </div>
              </div>
              <a
                href="https://wa.me/919389517814?text=Hello%2C%20I%20need%20support%20with%20my%20order"
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>

            {/* Shop CTA */}
            <div className="overflow-hidden rounded-3xl bg-zinc-900 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-pink-400">Bulk Ordering</p>
              <h3 className="mt-2 text-base font-bold text-white">Ready for your next order?</h3>
              <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                Custom bags, logo printing and bulk pricing — all from one place.
              </p>
              <Link
                href="/products"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-pink-500 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-400"
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
