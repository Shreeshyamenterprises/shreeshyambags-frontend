"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Eye,
  IndianRupee,
  Loader2,
  MessageCircle,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

type QuoteStatus = "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  quantityKg: number;
  gsm?: number;
  printing: boolean;
  message?: string;
  enquiryType: string;
  status: QuoteStatus;
  adminPricePerKg?: number;
  adminNote?: string;
  createdAt: string;
  product?: { title: string; slug: string };
  variant?: { size: string; color: string; shape: string };
};

const STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bg: string; ring: string; icon: React.ReactNode }> = {
  PENDING:  { label: "Pending",  color: "text-amber-700",  bg: "bg-amber-50",  ring: "ring-amber-200",  icon: <Clock className="h-3 w-3" /> },
  REVIEWED: { label: "Reviewed", color: "text-blue-700",   bg: "bg-blue-50",   ring: "ring-blue-200",   icon: <Eye className="h-3 w-3" /> },
  APPROVED: { label: "Approved", color: "text-emerald-700",bg: "bg-emerald-50",ring: "ring-emerald-200",icon: <CheckCircle2 className="h-3 w-3" /> },
  REJECTED: { label: "Rejected", color: "text-red-700",    bg: "bg-red-50",    ring: "ring-red-200",    icon: <XCircle className="h-3 w-3" /> },
};

function StatusBadge({ status }: { status: QuoteStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${cfg.bg} ${cfg.color} ${cfg.ring}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const init = parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 text-xs font-bold uppercase text-white shadow-sm">
      {init.toUpperCase()}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [leads, setLeads]       = useState<Lead[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [saving, setSaving]     = useState(false);
  const [adminPrice, setAdminPrice] = useState("");
  const [adminNote, setAdminNote]   = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "ALL">("ALL");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => {
        if (res.data?.user?.role !== "ADMIN") {
          toast.error("Access denied.");
          router.replace("/");
        } else {
          loadLeads();
        }
      })
      .catch(() => router.replace("/login"));
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      const res = await api.get("/quotes");
      setLeads(res.data ?? []);
    } catch {
      toast.error("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }

  function openLead(lead: Lead) {
    setSelected(lead);
    setAdminPrice(lead.adminPricePerKg?.toString() ?? "");
    setAdminNote(lead.adminNote ?? "");
  }

  async function saveLead(status: QuoteStatus) {
    if (!selected) return;
    try {
      setSaving(true);
      const updated = await api.patch(`/quotes/${selected.id}`, {
        status,
        ...(adminPrice ? { adminPricePerKg: Number(adminPrice) } : {}),
        ...(adminNote  ? { adminNote } : {}),
      });
      setLeads((prev) => prev.map((l) => l.id === selected.id ? { ...l, ...updated.data } : l));
      setSelected(null);
      toast.success("Lead updated successfully.");
    } catch {
      toast.error("Failed to update lead.");
    } finally {
      setSaving(false);
    }
  }

  const counts = {
    ALL:      leads.length,
    PENDING:  leads.filter((l) => l.status === "PENDING").length,
    REVIEWED: leads.filter((l) => l.status === "REVIEWED").length,
    APPROVED: leads.filter((l) => l.status === "APPROVED").length,
    REJECTED: leads.filter((l) => l.status === "REJECTED").length,
  };

  const filtered = leads
    .filter((l) => statusFilter === "ALL" || l.status === statusFilter)
    .filter((l) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email ?? "").toLowerCase().includes(q) ||
        (l.product?.title ?? "").toLowerCase().includes(q)
      );
    });

  const whatsappUrl = (lead: Lead) =>
    `https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
      `Hello ${lead.name}, we received your enquiry from PieBags. How can we help you?`
    )}`;

  return (
    <main className="min-h-screen bg-[#f4f5f9]">

      {/* ── Top header banner ── */}
      <div className="border-b border-zinc-200/60 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: brand + page title */}
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 shadow-sm">
                <ShieldCheck className="h-4.5 w-4.5 text-white h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-500">Admin Panel</p>
                <h1 className="text-base font-bold leading-none text-zinc-900">Leads &amp; Enquiries</h1>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadLeads}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm transition hover:bg-zinc-50 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* ── Stat cards ── */}
        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {/* Total */}
          <div className="col-span-2 flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 px-5 py-4 shadow-sm sm:col-span-1 lg:col-span-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total</p>
              <p className="text-2xl font-bold text-white">{counts.ALL}</p>
            </div>
          </div>

          {[
            { key: "PENDING"  as const, label: "Pending",  bg: "bg-amber-50",   ring: "ring-amber-100",  border: "border-l-amber-400",  text: "text-amber-600",  icon: <Clock className="h-4 w-4 text-amber-500" /> },
            { key: "REVIEWED" as const, label: "Reviewed", bg: "bg-blue-50",    ring: "ring-blue-100",   border: "border-l-blue-400",   text: "text-blue-600",   icon: <Eye className="h-4 w-4 text-blue-500" /> },
            { key: "APPROVED" as const, label: "Approved", bg: "bg-emerald-50", ring: "ring-emerald-100",border: "border-l-emerald-400", text: "text-emerald-600",icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" /> },
            { key: "REJECTED" as const, label: "Rejected", bg: "bg-red-50",     ring: "ring-red-100",    border: "border-l-red-400",    text: "text-red-600",    icon: <XCircle className="h-4 w-4 text-red-500" /> },
          ].map(({ key, label, bg, ring, border, text, icon }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? "ALL" : key)}
              className={`group flex items-center gap-3 overflow-hidden rounded-2xl border-l-4 bg-white px-4 py-4 shadow-sm ring-1 transition hover:shadow-md ${border} ${ring} ${statusFilter === key ? "ring-2" : ""}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                {icon}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
                <p className={`text-xl font-bold ${text}`}>{counts[key]}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Search + filter bar ── */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, product…"
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 placeholder:text-zinc-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:text-zinc-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(["ALL", "PENDING", "REVIEWED", "APPROVED", "REJECTED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
                  statusFilter === s
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                {s === "ALL" ? `All (${counts.ALL})` : `${s[0] + s.slice(1).toLowerCase()} (${counts[s as QuoteStatus]})`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Leads table ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-24 shadow-sm ring-1 ring-zinc-100">
            <Loader2 className="h-7 w-7 animate-spin text-pink-400" />
            <p className="text-sm font-medium text-zinc-400">Loading leads…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-24 text-center shadow-sm ring-1 ring-zinc-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50">
              <ShieldAlert className="h-7 w-7 text-zinc-300" />
            </div>
            <div>
              <p className="font-semibold text-zinc-700">No leads found</p>
              <p className="mt-1 text-sm text-zinc-400">Try adjusting your search or filter.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80">
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400">Customer</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400">Type &amp; Product</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400">Order Details</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400">Status</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400">Date</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="group transition hover:bg-zinc-50/50">

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Initials name={lead.name} />
                          <div>
                            <p className="font-semibold text-zinc-900">{lead.name}</p>
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex items-center gap-1 text-xs text-zinc-400 transition hover:text-pink-500"
                            >
                              <Phone className="h-3 w-3" />{lead.phone}
                            </a>
                            {lead.email && (
                              <p className="truncate text-xs text-zinc-400" style={{ maxWidth: 160 }}>{lead.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Type + Product */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
                          lead.enquiryType === "CONTACT"
                            ? "bg-blue-50 text-blue-600 ring-blue-100"
                            : "bg-pink-50 text-pink-600 ring-pink-100"
                        }`}>
                          {lead.enquiryType === "CONTACT" ? "Enquiry" : "Quote"}
                        </span>
                        <p className="mt-1.5 font-medium text-zinc-800 leading-snug">
                          {lead.product?.title ?? (lead.enquiryType === "CONTACT" ? "General Enquiry" : "—")}
                        </p>
                        {lead.variant && (
                          <p className="text-xs text-zinc-400">
                            {lead.variant.size} · {lead.variant.color} · {lead.variant.shape}
                          </p>
                        )}
                      </td>

                      {/* Order details */}
                      <td className="px-5 py-4">
                        {lead.quantityKg > 0 ? (
                          <p className="font-semibold text-zinc-900">{lead.quantityKg} KG</p>
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                        {lead.gsm && <p className="text-xs text-zinc-400">{lead.gsm} GSM</p>}
                        {lead.printing && lead.enquiryType !== "CONTACT" && (
                          <span className="mt-1 inline-flex items-center rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-600 ring-1 ring-pink-100">
                            Custom Print
                          </span>
                        )}
                        {lead.adminPricePerKg && (
                          <p className="mt-1 flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                            <IndianRupee className="h-3 w-3" />{lead.adminPricePerKg}/kg quoted
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={lead.status} />
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-zinc-700">
                          {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {new Date(lead.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openLead(lead)}
                            className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-zinc-700"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Review
                          </button>
                          <a
                            href={whatsappUrl(lead)}
                            target="_blank"
                            rel="noreferrer"
                            title="Chat on WhatsApp"
                            className="flex h-7 w-7 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm transition hover:bg-green-600"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-3">
              <p className="text-xs text-zinc-400">
                Showing <span className="font-semibold text-zinc-600">{filtered.length}</span> of{" "}
                <span className="font-semibold text-zinc-600">{leads.length}</span> leads
                {search && <> · matching &ldquo;{search}&rdquo;</>}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail drawer (right side slide-in) ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">

            {/* Drawer header */}
            <div className="flex shrink-0 items-start justify-between border-b border-zinc-100 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${
                    selected.enquiryType === "CONTACT"
                      ? "bg-blue-50 text-blue-600 ring-blue-100"
                      : "bg-pink-50 text-pink-600 ring-pink-100"
                  }`}>
                    {selected.enquiryType === "CONTACT" ? "General Enquiry" : "Quote Request"}
                  </span>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <Initials name={selected.name} />
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">{selected.name}</h2>
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-pink-500">
                      <Phone className="h-3 w-3" />{selected.phone}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={whatsappUrl(selected)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-green-600"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">

              {/* Contact info */}
              <div className="mb-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Contact Information</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Phone",   value: selected.phone },
                    { label: "Email",   value: selected.email || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-zinc-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order details */}
              <div className="mb-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Order Details</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Product",  value: selected.product?.title || "—" },
                    { label: "Quantity", value: selected.quantityKg > 0 ? `${selected.quantityKg} KG` : "—" },
                    { label: "GSM",      value: selected.gsm ? `${selected.gsm} GSM` : "—" },
                    { label: "Printing", value: selected.enquiryType === "CONTACT" ? "—" : (selected.printing ? "Yes" : "No") },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-zinc-800">{value}</p>
                    </div>
                  ))}
                </div>
                {selected.variant && (
                  <div className="mt-2 rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Variant</p>
                    <p className="mt-0.5 text-sm font-semibold text-zinc-800">
                      {selected.variant.size} · {selected.variant.color} · {selected.variant.shape}
                    </p>
                  </div>
                )}
              </div>

              {/* Customer message */}
              {selected.message && (
                <div className="mb-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Customer Message</p>
                  <div className="rounded-xl bg-blue-50 px-4 py-3 ring-1 ring-blue-100">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      <MessageSquare className="h-3 w-3" /> Message
                    </div>
                    <p className="text-sm leading-6 text-zinc-700">{selected.message}</p>
                  </div>
                </div>
              )}

              {/* Admin response */}
              <div className="space-y-4 border-t border-zinc-100 pt-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-pink-500" />
                  <p className="text-sm font-bold text-zinc-900">Admin Response</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600">
                    Price Quote <span className="font-normal text-zinc-400">(₹ per kg)</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                      <IndianRupee className="h-4 w-4 text-zinc-400" />
                    </span>
                    <input
                      type="number"
                      value={adminPrice}
                      onChange={(e) => setAdminPrice(e.target.value)}
                      placeholder="e.g. 220"
                      className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600">Internal Note</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    placeholder="Notes about this lead (not visible to customer)…"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none"
                  />
                </div>

                {/* Status action buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => saveLead("REVIEWED")}
                    disabled={saving}
                    className="flex flex-col items-center gap-1 rounded-xl border-2 border-blue-200 bg-blue-50 py-3 text-xs font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                    Reviewed
                  </button>
                  <button
                    onClick={() => saveLead("APPROVED")}
                    disabled={saving}
                    className="flex flex-col items-center gap-1 rounded-xl border-2 border-emerald-200 bg-emerald-50 py-3 text-xs font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => saveLead("REJECTED")}
                    disabled={saving}
                    className="flex flex-col items-center gap-1 rounded-xl border-2 border-red-200 bg-red-50 py-3 text-xs font-bold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
