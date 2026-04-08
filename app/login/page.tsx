"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShoppingBag, ClipboardList, BadgePercent } from "lucide-react";
import { api } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

type FormData = {
  identifier: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  const identifier = data.identifier.trim();

  if (!identifier) {
    errors.identifier = "Please enter your email or phone number.";
  } else {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^[0-9]{10}$/.test(identifier);
    if (!isEmail && !isPhone) {
      errors.identifier = "Enter a valid email address or 10 digit phone number.";
    }
  }

  if (!data.password) {
    errors.password = "Please enter your password.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

const inputBase =
  "w-full rounded-xl border bg-white pl-10 pr-4 py-3.5 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400";
const inputNormal =
  "border-zinc-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100";
const inputError =
  "border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-2 focus:ring-red-100";

export default function LoginPage() {
  const router = useRouter();
  const storeLogin = useAuthStore((s) => s.login);

  const [form, setForm] = useState<FormData>({ identifier: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace("/");
  }, []);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setApiError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      setApiError("");

      const identifier = form.identifier.trim();
      const isPhone = /^[0-9]{10}$/.test(identifier);

      const res = await api.post("/auth/login", {
        email: isPhone ? undefined : String(identifier).toLowerCase(),
        phone: isPhone ? String(identifier) : undefined,
        password: String(form.password),
      });

      if (res.data?.token) {
        storeLogin(res.data.token);
        toast.success("Welcome back!", {
          description: "You have logged in successfully.",
          duration: 3000,
        });
        setTimeout(() => router.replace("/"), 1500);
        return;
      }

      setApiError("Login succeeded but token was not returned.");
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message;
      setApiError(
        Array.isArray(message) ? message.join(", ") : message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-fuchsia-50/40 lg:h-screen lg:overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-200/25 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-fuchsia-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:h-screen lg:px-8 lg:py-6">
        <div className="w-full max-w-5xl">
          {/* Card */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-zinc-900/10 ring-1 ring-zinc-900/5 lg:grid lg:grid-cols-[1fr_1.05fr]">

            {/* ── Left panel (desktop only) ── */}
            <div className="relative hidden overflow-hidden lg:block">
              <Image
                src="/signup-bag-sample.jpeg"
                alt="Premium non-woven bag sample"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-zinc-900/85 to-pink-950/75" />

              <div className="relative z-10 flex h-full flex-col justify-between p-8">
                {/* Brand */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pink-200">
                      Shreeshyam Packaging
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold leading-snug text-white xl:text-3xl">
                    Welcome back to Shreeshyam Packaging.
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-zinc-300/90">
                    Login to manage your orders, request bulk quotes, compare GSM options and continue your custom packaging purchases.
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  {[
                    { icon: ShoppingBag, title: "Resume Your Orders", desc: "Pick up where you left off with saved cart and orders." },
                    { icon: ClipboardList, title: "Bulk Quote Requests", desc: "Access and track all your bulk pricing requests easily." },
                    { icon: BadgePercent, title: "Exclusive Business Pricing", desc: "Logged-in users get access to slab-based bulk pricing." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur-sm">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/20">
                        <Icon className="h-3.5 w-3.5 text-pink-300" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{title}</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-zinc-400">{desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { value: "10k+", label: "Bags Supplied" },
                      { value: "200+", label: "Happy Clients" },
                      { value: "3 Types", label: "Bag Styles" },
                    ].map(({ value, label }) => (
                      <div key={label} className="rounded-xl bg-white/8 p-2.5 text-center ring-1 ring-white/10">
                        <p className="text-sm font-bold text-white">{value}</p>
                        <p className="mt-0.5 text-[10px] leading-4 text-zinc-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right panel: form ── */}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-10">
              {/* Mobile brand mark */}
              <div className="mb-8 flex items-center gap-2 lg:hidden">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
                </div>
                <span className="text-sm font-bold tracking-tight text-zinc-800">Shreeshyam Packaging</span>
              </div>

              {/* Heading */}
              <div className="mb-7">
                <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-pink-600 ring-1 ring-pink-100">
                  Login
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                  Login with your email address or phone number.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Identifier */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-zinc-700">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={form.identifier}
                      onChange={(e) => {
                        const value = e.target.value;
                        const onlyDigits = value.replace(/\D/g, "");
                        const shouldTreatAsPhone = /^[0-9]+$/.test(value) && value.length <= 10;
                        updateField("identifier", shouldTreatAsPhone ? onlyDigits : value);
                      }}
                      placeholder="Email or 10 digit phone number"
                      className={`${inputBase} ${errors.identifier ? inputError : inputNormal}`}
                    />
                  </div>
                  {errors.identifier && (
                    <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.identifier}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-zinc-700">Password</label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-pink-600 transition hover:text-pink-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Enter your password"
                      className={`${inputBase} pr-12 ${errors.password ? inputError : inputNormal}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                      <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* API error */}
                {apiError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-100 text-center text-xs font-bold leading-4 text-red-500">!</span>
                    {apiError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Logging in…
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="mt-5 text-center text-[11px] leading-5 text-zinc-400 lg:text-left">
                Your account information is kept secure and never shared.
              </p>

              <p className="mt-4 text-center text-sm text-zinc-500 lg:text-left">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-pink-600 transition hover:text-pink-700">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
