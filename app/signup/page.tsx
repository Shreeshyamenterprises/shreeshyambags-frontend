"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Truck, Tag } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  const trimmedName = data.name.trim();
  const trimmedEmail = data.email.trim();
  const trimmedPhone = data.phone.trim();

  if (!trimmedName) {
    errors.name = "Please enter your full name.";
  } else if (!/^[A-Za-z ]{2,50}$/.test(trimmedName)) {
    errors.name = "Use only letters and spaces.";
  }

  if (!trimmedEmail) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!trimmedPhone) {
    errors.phone = "Please enter your phone number.";
  } else if (!/^[0-9]{10}$/.test(trimmedPhone)) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }

  if (!data.password) {
    errors.password = "Please enter your password.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(data.password)) {
    errors.password = "Password must include letters and numbers.";
  }

  return errors;
}

function getPasswordStrength(password: string) {
  if (!password) return { label: "", width: "0%", color: "bg-zinc-200", textColor: "text-zinc-400" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", width: "33%", color: "bg-red-400", textColor: "text-red-500" };
  if (score <= 4) return { label: "Medium", width: "66%", color: "bg-amber-400", textColor: "text-amber-600" };
  return { label: "Strong", width: "100%", color: "bg-emerald-500", textColor: "text-emerald-600" };
}

function InputField({
  label,
  icon: Icon,
  error,
  hint,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-zinc-700">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
          <Icon className="h-4 w-4" />
        </span>
        {children}
      </div>
      {error ? (
        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border bg-white pl-10 pr-4 py-2.5 lg:py-2 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400";
const inputNormal =
  "border-zinc-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100";
const inputError =
  "border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-2 focus:ring-red-100";

export default function SignupPage() {
  const router = useRouter();
  const storeLogin = useAuthStore((s) => s.login);

  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

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

      const res = await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });

      if (res.data?.token) {
        storeLogin(res.data.token);
      }

      toast.success("Account created successfully! Welcome aboard.", {
        description: "Redirecting you to the home page…",
        duration: 3000,
      });
      setTimeout(() => router.replace("/"), 1500);
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message;
      setApiError(
        Array.isArray(message) ? message.join(", ") : message || "Signup failed. Please try again.",
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

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:h-screen lg:px-8 lg:py-4">
        <div className="w-full max-w-5xl">
          {/* Card */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-zinc-900/10 ring-1 ring-zinc-900/5 lg:grid lg:grid-cols-[1fr_1.05fr]">

            {/* ── Left panel (desktop only) ── */}
            <div className="relative hidden overflow-hidden lg:block">
              <Image
                src="/signup-collage.png"
                alt="Shreeshyam Packaging products"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-zinc-900/85 to-pink-950/75" />

              <div className="relative z-10 flex h-full flex-col justify-between p-7 lg:p-8">
                {/* Brand */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pink-200">
                      Shreeshyam Packaging
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold leading-snug text-white xl:text-3xl">
                    Smarter bulk bag ordering starts here.
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-zinc-300/90">
                    Join businesses managing custom non-woven bag orders, comparing GSM options, and getting bulk pricing — all in one place.
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  {[
                    { icon: Truck, title: "Bulk Order Management", desc: "Track 200 KG, 500 KG & 1000 KG orders easily." },
                    { icon: Tag, title: "Custom Branding", desc: "Logo printing & promotional designs on every bag." },
                    { icon: ShieldCheck, title: "Secure Business Account", desc: "Order history and quotes saved and protected." },
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
            <div className="flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-9 lg:py-6">
              {/* Mobile brand mark */}
              <div className="mb-6 flex items-center gap-2 lg:hidden">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
                </div>
                <span className="text-sm font-bold tracking-tight text-zinc-800">Shreeshyam Packaging</span>
              </div>

              {/* Heading */}
              <div className="mb-4 lg:mb-5">
                <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-pink-600 ring-1 ring-pink-100">
                  Create Account
                </span>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Join Shreeshyam Packaging
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Sign up free — no credit card required.
                </p>
              </div>

              <>
                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Name + Email — side by side on sm+ */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField label="Full Name" icon={User} error={errors.name}>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Your full name"
                          className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
                        />
                      </InputField>

                      <InputField label="Email Address" icon={Mail} error={errors.email}>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="you@example.com"
                          className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                        />
                      </InputField>
                    </div>

                    <InputField
                      label="Phone Number"
                      icon={Phone}
                      error={errors.phone}
                      hint={!errors.phone ? "We'll use this for order updates only." : undefined}
                    >
                      <div className="flex items-center">
                        <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 select-none border-r border-zinc-200 pr-2.5 text-xs font-semibold text-zinc-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={form.phone}
                          onChange={(e) =>
                            updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          placeholder="10 digit number"
                          className={`${inputBase} pl-[4.25rem] ${errors.phone ? inputError : inputNormal}`}
                        />
                      </div>
                    </InputField>

                    <InputField label="Password" icon={Lock} error={errors.password}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="Min 8 chars with letters & numbers"
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
                    </InputField>

                    {/* Password strength bar */}
                    {form.password && (
                      <div className="-mt-1 space-y-1.5">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${passwordStrength.color}`}
                            style={{ width: passwordStrength.width }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Password strength</span>
                          <span className={`font-semibold ${passwordStrength.textColor}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}

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
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Creating account…
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Trust note */}
                  <p className="mt-3 text-center text-[11px] leading-5 text-zinc-400 lg:text-left">
                    By creating an account you agree to receive essential order & account communications. No spam, ever.
                  </p>

                  {/* Login link */}
                  <p className="mt-3 text-center text-sm text-zinc-500 lg:text-left">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-pink-600 transition hover:text-pink-700">
                      Login here
                    </Link>
                  </p>
                </>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
