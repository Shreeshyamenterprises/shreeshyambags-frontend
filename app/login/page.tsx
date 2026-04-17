"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, ShoppingBag, ClipboardList, BadgePercent } from "lucide-react";
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
    <main className="h-screen overflow-hidden bg-[#f7f7fb]">
      <section className="relative h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-3xl" />

        <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] ring-1 ring-white/60 lg:grid-cols-[1.05fr_0.95fr]">

            {/* Left panel */}
            <div className="relative hidden min-h-[760px] overflow-hidden bg-zinc-900 lg:block">
              <Image
                src="/signup-bag-sample.jpeg"
                alt="Shreeshyam Packaging"
                fill
                className="object-cover opacity-45"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-zinc-900/75 to-pink-900/60" />

              <div className="relative z-10 flex h-full flex-col justify-between p-10">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pink-300">
                    Customer Portal
                  </p>
                  <h1 className="mt-5 max-w-lg text-4xl font-bold leading-tight text-white">
                    Welcome back to Shreeshyam Packaging.
                  </h1>
                  <p className="mt-5 max-w-md text-sm leading-7 text-zinc-300">
                    Login to manage your orders, request bulk quotes, compare GSM options and continue your custom packaging purchases.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.75rem] bg-white/8 p-5 backdrop-blur ring-1 ring-white/10">
                    <p className="text-sm font-semibold text-white">Resume Your Orders</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Pick up where you left off with your saved cart and active orders.
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] bg-white/8 p-5 backdrop-blur ring-1 ring-white/10">
                    <p className="text-sm font-semibold text-white">Bulk Quote Requests</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Access slab-based bulk pricing and manage all your quote enquiries in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
              <div className="w-full max-w-md">
                <div className="text-center lg:text-left">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                    Customer Login
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                    Welcome back
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    Sign in with your email or phone number.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {/* Identifier */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">
                      Email or Phone Number
                    </label>
                    <div
                      className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                        errors.identifier
                          ? "border-red-400 bg-red-50"
                          : "border-zinc-300 focus-within:border-pink-400"
                      }`}
                    >
                      {/^[0-9]+$/.test(form.identifier) && form.identifier.length <= 10 ? (
                        <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                      ) : (
                        <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                      )}
                      <input
                        type="text"
                        value={form.identifier}
                        onChange={(e) => {
                          const value = e.target.value;
                          const onlyDigits = value.replace(/\D/g, "");
                          const shouldTreatAsPhone = /^[0-9]+$/.test(value) && value.length <= 10;
                          updateField("identifier", shouldTreatAsPhone ? onlyDigits : value);
                        }}
                        placeholder="Enter email or 10 digit phone number"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                      />
                    </div>
                    {errors.identifier && (
                      <p className="mt-2 text-xs text-red-500">{errors.identifier}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="block text-sm font-medium text-zinc-700">Password</label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-pink-600 transition hover:text-pink-700"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div
                      className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                        errors.password
                          ? "border-red-400 bg-red-50"
                          : "border-zinc-300 focus-within:border-pink-400"
                      }`}
                    >
                      <Lock className="h-4 w-4 shrink-0 text-zinc-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="text-zinc-400 transition hover:text-zinc-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* API error */}
                  {apiError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {apiError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Logging in…
                      </span>
                    ) : (
                      "Login to Account"
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-600 lg:text-left">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-semibold text-pink-600 transition hover:text-pink-700">
                    Create account
                  </Link>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
