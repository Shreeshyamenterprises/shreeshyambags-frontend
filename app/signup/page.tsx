"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

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
  if (!password) {
    return { label: "", width: "0%", tone: "bg-zinc-200" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { label: "Weak", width: "33%", tone: "bg-red-400" };
  }
  if (score <= 4) {
    return { label: "Medium", width: "66%", tone: "bg-amber-400" };
  }
  return { label: "Strong", width: "100%", tone: "bg-emerald-500" };
}

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  const googleSignupUrl = useMemo(() => {
    const base =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
      "http://localhost:3000";
    return `${base}/auth/google`;
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

      const res = await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });

      if (res.data?.token) {
        setToken(res.data.token);
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message;

      setApiError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#ffe4ef_0%,_#fff7fb_30%,_#ffffff_65%)] lg:h-screen">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-[-40px] h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-[-80px] top-[20%] h-80 w-80 rounded-full bg-fuchsia-200/30 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[20%] h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-4 sm:px-6 lg:h-screen lg:px-8 lg:py-4">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_20px_90px_rgba(20,20,20,0.10)] backdrop-blur-xl lg:max-h-[92vh] lg:grid-cols-[1fr_0.95fr]">
          <div className="relative hidden min-h-[620px] overflow-hidden bg-zinc-950 lg:block">
            <Image
              src="/signup-bag-sample.jpeg"
              alt="Premium non-woven bag sample"
              fill
              priority
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-pink-950/70" />

            <div className="relative z-10 flex h-full flex-col justify-between p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-pink-200">
                    Shree Shyam Bags
                  </span>
                </div>

                <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-white xl:text-4xl">
                  Create your account for smarter bulk bag ordering.
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-300">
                  Explore GSM options, compare bulk pricing, manage custom
                  printing requests, and streamline your packaging orders in one
                  place.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white">
                    Bulk pricing made simple
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Easily compare 200 KG, 500 KG and 1000 KG order slabs.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white">
                    Branding-friendly packaging
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Add your logo, store name, or custom print for a premium
                    brand presence.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10">
                    <p className="text-base font-bold text-white">10k+</p>
                    <p className="mt-1 text-[11px] text-zinc-300">
                      Bags Supplied
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10">
                    <p className="text-base font-bold text-white">Bulk</p>
                    <p className="mt-1 text-[11px] text-zinc-300">
                      Order Support
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10">
                    <p className="text-base font-bold text-white">Custom</p>
                    <p className="mt-1 text-[11px] text-zinc-300">Printing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-5 sm:p-6 lg:p-8">
            <div className="w-full max-w-md lg:max-h-[82vh] lg:overflow-y-auto">
              <div className="mb-6 text-center lg:text-left">
                <div className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-600 ring-1 ring-pink-100">
                  Create Account
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Join Shree Shyam Bags
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Fast signup for premium non-woven bag ordering and custom
                  packaging solutions.
                </p>
              </div>

              <a
                href={googleSignupUrl}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5Z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7Z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.2 26.7 36 24 36c-5.3 0-9.7-3.3-11.4-8l-6.5 5C9.4 39.5 16.1 44 24 44Z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l.1-.1 6.2 5.2C37 38.3 44 33 44 24c0-1.2-.1-2.3-.4-3.5Z"
                  />
                </svg>
                Continue with Google
              </a>

              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Or continue with email
                </span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 ${
                        errors.name
                          ? "border-red-300 bg-red-50/70 focus:border-red-400"
                          : "border-zinc-200 bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                      }`}
                    />
                  </div>
                  {errors.name ? (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 ${
                      errors.email
                        ? "border-red-300 bg-red-50/70 focus:border-red-400"
                        : "border-zinc-200 bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    }`}
                  />
                  {errors.email ? (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) =>
                      updateField(
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    placeholder="Enter your 10 digit phone number"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 ${
                      errors.phone
                        ? "border-red-300 bg-red-50/70 focus:border-red-400"
                        : "border-zinc-200 bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    }`}
                  />
                  {errors.phone ? (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.phone}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-zinc-500">
                      We’ll use this for order updates and support.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Create password with letters and numbers"
                      className={`w-full rounded-2xl border px-4 py-3 pr-14 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 ${
                        errors.password
                          ? "border-red-300 bg-red-50/70 focus:border-red-400"
                          : "border-zinc-200 bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="mt-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${passwordStrength.tone}`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-zinc-500">
                        Use 8+ characters with letters and numbers
                      </p>
                      {form.password ? (
                        <span className="text-xs font-semibold text-zinc-700">
                          {passwordStrength.label}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {errors.password ? (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.password}
                    </p>
                  ) : null}
                </div>

                {apiError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {apiError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-5 rounded-2xl bg-zinc-50 px-4 py-3 text-xs leading-6 text-zinc-500 ring-1 ring-zinc-100">
                By signing up, you agree to receive essential account and order
                related communication.
              </div>

              <p className="mt-5 text-center text-sm text-zinc-600 lg:text-left">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-pink-600 transition hover:text-pink-700"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
