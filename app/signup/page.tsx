"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Lock, Truck, Tag, ShieldCheck } from "lucide-react";
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
                src="/signup-collage.png"
                alt="Shreeshyam Packaging products"
                fill
                className="object-cover opacity-45"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-zinc-900/75 to-pink-900/60" />

              <div className="relative z-10 flex h-full flex-col justify-between p-10">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pink-300">
                    New Account
                  </p>
                  <h1 className="mt-5 max-w-lg text-4xl font-bold leading-tight text-white">
                    Smarter bulk bag ordering starts here.
                  </h1>
                  <p className="mt-5 max-w-md text-sm leading-7 text-zinc-300">
                    Join businesses managing custom non-woven bag orders, comparing GSM options, and getting bulk pricing — all in one place.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.75rem] bg-white/8 p-5 backdrop-blur ring-1 ring-white/10">
                    <p className="text-sm font-semibold text-white">Bulk Order Management</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Track 200 KG, 500 KG &amp; 1000 KG orders with full visibility.
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] bg-white/8 p-5 backdrop-blur ring-1 ring-white/10">
                    <p className="text-sm font-semibold text-white">Custom Branding &amp; Secure Account</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Logo printing on every bag. Your order history and quotes saved securely.
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
                    Create Account
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                    Join Shreeshyam Packaging
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    Sign up free — no credit card required.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {/* Name + Email row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Full Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">Full Name</label>
                      <div
                        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                          errors.name
                            ? "border-red-400 bg-red-50"
                            : "border-zinc-300 focus-within:border-pink-400"
                        }`}
                      >
                        <User className="h-4 w-4 shrink-0 text-zinc-400" />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          placeholder="Your full name"
                          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                        />
                      </div>
                      {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">Email Address</label>
                      <div
                        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                          errors.email
                            ? "border-red-400 bg-red-50"
                            : "border-zinc-300 focus-within:border-pink-400"
                        }`}
                      >
                        <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                        />
                      </div>
                      {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Phone Number</label>
                    <div
                      className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                        errors.phone
                          ? "border-red-400 bg-red-50"
                          : "border-zinc-300 focus-within:border-pink-400"
                      }`}
                    >
                      <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                      <span className="border-r border-zinc-200 pr-3 text-xs font-semibold text-zinc-500">
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
                        className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                      />
                    </div>
                    {errors.phone && <p className="mt-2 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Password</label>
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
                        placeholder="Min 8 chars with letters & numbers"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="text-zinc-400 transition hover:text-zinc-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password}</p>}

                    {/* Password strength */}
                    {form.password && (
                      <div className="mt-2 space-y-1">
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
                        Creating account…
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] leading-5 text-zinc-400 lg:text-left">
                  By creating an account you agree to receive essential order &amp; account communications. No spam, ever.
                </p>

                <p className="mt-4 text-center text-sm text-zinc-600 lg:text-left">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-pink-600 transition hover:text-pink-700">
                    Login here
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
