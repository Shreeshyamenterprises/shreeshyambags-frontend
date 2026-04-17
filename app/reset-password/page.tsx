"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

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

  if (!token) {
    return (
      <div className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
            <Lock className="h-7 w-7 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">Invalid Link</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">Invalid Reset Link</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              This link is missing a reset token. Please request a new password reset.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="flex w-full max-w-md flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">Success</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">Password Reset!</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
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
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
      <div className="w-full max-w-md">
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
            Set New Password
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
            Create new password
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {/* New password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">New Password</label>
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
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
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
            {errors.password && (
              <p className="mt-2 text-xs text-red-500">{errors.password}</p>
            )}

            {/* Strength bar */}
            {password && (
              <div className="mt-2 space-y-1">
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
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Confirm Password</label>
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                errors.confirm
                  ? "border-red-400 bg-red-50"
                  : "border-zinc-300 focus-within:border-pink-400"
              }`}
            >
              <Lock className="h-4 w-4 shrink-0 text-zinc-400" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })); }}
                placeholder="Re-enter your new password"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="text-zinc-400 transition hover:text-zinc-700"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm && (
              <p className="mt-2 text-xs text-red-500">{errors.confirm}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Resetting password…
              </span>
            ) : (
              "Reset Password"
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
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
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
                    Security
                  </p>
                  <h1 className="mt-5 max-w-lg text-4xl font-bold leading-tight text-white">
                    Create a new password.
                  </h1>
                  <p className="mt-5 max-w-md text-sm leading-7 text-zinc-300">
                    Choose a strong password with at least 8 characters, including letters and numbers.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { title: "Minimum 8 characters", desc: "Longer passwords are harder to crack." },
                    { title: "Mix letters & numbers", desc: "Include both alphabets and digits for extra security." },
                    { title: "Special characters help", desc: "Add symbols like @, #, ! for maximum strength." },
                  ].map(({ title, desc }) => (
                    <div key={title} className="rounded-[1.75rem] bg-white/8 p-5 backdrop-blur ring-1 ring-white/10">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <Suspense fallback={
              <div className="flex items-center justify-center p-12 text-sm text-zinc-400">Loading…</div>
            }>
              <ResetPasswordForm />
            </Suspense>

          </div>
        </div>
      </section>
    </main>
  );
}
