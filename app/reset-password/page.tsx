"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const inputBase =
  "w-full rounded-xl border bg-white pl-10 pr-12 py-3.5 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400";
const inputNormal =
  "border-zinc-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100";
const inputError =
  "border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-2 focus:ring-red-100";

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

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getPasswordStrength(password);

  function validate() {
    const errs: { password?: string; confirm?: string } = {};
    if (!password) errs.password = "Please enter a new password.";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password))
      errs.password = "Password must include letters and numbers.";
    if (!confirm) errs.confirm = "Please confirm your password.";
    else if (password !== confirm) errs.confirm = "Passwords do not match.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      toast.success("Password reset successfully!", {
        description: "You can now log in with your new password.",
        duration: 4000,
      });
      setTimeout(() => router.replace("/login"), 2000);
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(
        Array.isArray(message) ? message.join(", ") : message || "Reset failed. The link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-10">
      {/* Mobile brand */}
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200">
          <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
        </div>
        <span className="text-sm font-bold tracking-tight text-zinc-800">Shreeshyam Packaging</span>
      </div>

      {!token ? (
        /* Invalid link state */
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
            <Lock className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Invalid Reset Link</h1>
            <p className="mt-2 text-sm text-zinc-500">
              This link is missing a reset token. Please request a new password reset.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Request New Link
          </Link>
        </div>
      ) : done ? (
        /* Success state */
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Password Reset!</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Your password has been updated. Redirecting you to login…
            </p>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-pink-600 transition hover:text-pink-700"
          >
            Go to Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-7">
            <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-pink-600 ring-1 ring-pink-100">
              Set New Password
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Create new password
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-700">New Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  placeholder="Min 8 chars with letters & numbers"
                  className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
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
              {errors.password ? (
                <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                  <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                  {errors.password}
                </p>
              ) : null}

              {/* Strength bar */}
              {password && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Password strength</span>
                    <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-700">Confirm Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })); }}
                  placeholder="Re-enter your new password"
                  className={`${inputBase} ${errors.confirm ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                  <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                  {errors.confirm}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-zinc-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Resetting password…
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <Link
            href="/login"
            className="mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 lg:justify-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-fuchsia-50/40 lg:h-screen lg:overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-200/25 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-fuchsia-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:h-screen lg:px-8 lg:py-6 lg:overflow-hidden">
        <div className="w-full max-w-5xl">
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-zinc-900/10 ring-1 ring-zinc-900/5 lg:grid lg:grid-cols-[1fr_1.05fr]">

            {/* Left panel */}
            <div className="relative hidden overflow-hidden lg:block">
              <Image
                src="/signup-bag-sample.jpeg"
                alt="Shreeshyam Packaging"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-zinc-900/85 to-pink-950/75" />

              <div className="relative z-10 flex h-full flex-col justify-between p-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-pink-200">
                      Shreeshyam Packaging
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold leading-snug text-white xl:text-3xl">
                    Create a new password.
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-zinc-300/90">
                    Choose a strong password with at least 8 characters, including letters and numbers.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { icon: "🔒", title: "Minimum 8 characters", desc: "Longer passwords are harder to crack." },
                    { icon: "🔡", title: "Mix letters & numbers", desc: "Include both alphabets and digits." },
                    { icon: "✨", title: "Special characters help", desc: "Add symbols like @, #, ! for extra strength." },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur-sm">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 text-sm">
                        {icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{title}</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-zinc-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <Suspense fallback={<div className="flex items-center justify-center p-12 text-sm text-zinc-400">Loading…</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
