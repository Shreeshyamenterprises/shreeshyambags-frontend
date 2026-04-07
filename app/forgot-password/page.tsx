"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const inputBase =
  "w-full rounded-xl border bg-white pl-10 pr-4 py-3.5 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400";
const inputNormal =
  "border-zinc-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100";
const inputError =
  "border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-2 focus:ring-red-100";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(value: string) {
    if (!value.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Please enter a valid email address.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(email);
    if (err) { setEmailError(err); return; }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
      setSent(true);
      toast.success("Reset link sent!", {
        description: "Check your inbox for the password reset email.",
        duration: 4000,
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
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
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-zinc-900/10 ring-1 ring-zinc-900/5 lg:grid lg:grid-cols-[1fr_1.05fr]">

            {/* ── Left panel (desktop only) ── */}
            <div className="relative hidden overflow-hidden lg:block">
              <Image
                src="/signup-bag-sample.jpeg"
                alt="Econest Packaging"
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
                      Econest Packaging
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold leading-snug text-white xl:text-3xl">
                    Forgot your password?
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-zinc-300/90">
                    No worries — enter your email and we'll send you a secure reset link valid for 1 hour.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { step: "1", title: "Enter your email", desc: "Provide the email address linked to your account." },
                    { step: "2", title: "Check your inbox", desc: "We'll send a secure reset link valid for 1 hour." },
                    { step: "3", title: "Set a new password", desc: "Click the link and create a strong new password." },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur-sm">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 text-xs font-bold text-pink-300">
                        {step}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{title}</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-zinc-400">{desc}</p>
                      </div>
                    </div>
                  ))}

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

            {/* ── Right panel ── */}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-10">
              {/* Mobile brand mark */}
              <div className="mb-8 flex items-center gap-2 lg:hidden">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
                </div>
                <span className="text-sm font-bold tracking-tight text-zinc-800">Econest Packaging</span>
              </div>

              {sent ? (
                /* Success state */
                <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
                    <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-pink-600 ring-1 ring-pink-100">
                      Email Sent
                    </span>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                      Check your inbox
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      We sent a reset link to{" "}
                      <span className="font-semibold text-zinc-800">{email}</span>.
                      It expires in 1 hour.
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Didn't receive it? Check spam or{" "}
                    <button
                      onClick={() => setSent(false)}
                      className="font-semibold text-pink-600 transition hover:text-pink-700"
                    >
                      try again
                    </button>
                    .
                  </p>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              ) : (
                <>
                  {/* Heading */}
                  <div className="mb-7">
                    <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-pink-600 ring-1 ring-pink-100">
                      Password Recovery
                    </span>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                      Forgot password?
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500">
                      Enter your account email and we'll send you a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-zinc-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                          placeholder="you@example.com"
                          className={`${inputBase} ${emailError ? inputError : inputNormal}`}
                        />
                      </div>
                      {emailError && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                          {emailError}
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
                          Sending reset link…
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-5 text-center text-[11px] leading-5 text-zinc-400 lg:text-left">
                    Reset links expire after 1 hour for your security.
                  </p>

                  <Link
                    href="/login"
                    className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 lg:justify-start"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
