"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

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
                    Account Recovery
                  </p>
                  <h1 className="mt-5 max-w-lg text-4xl font-bold leading-tight text-white">
                    Forgot your password?
                  </h1>
                  <p className="mt-5 max-w-md text-sm leading-7 text-zinc-300">
                    No worries — enter your email and we'll send a secure reset link valid for 1 hour.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { step: "1", title: "Enter your email", desc: "Provide the email address linked to your account." },
                    { step: "2", title: "Check your inbox", desc: "We'll send a secure reset link valid for 1 hour." },
                    { step: "3", title: "Set a new password", desc: "Click the link and create a strong new password." },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="rounded-[1.75rem] bg-white/8 p-5 backdrop-blur ring-1 ring-white/10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 text-xs font-bold text-pink-300">
                          {step}
                        </div>
                        <p className="text-sm font-semibold text-white">{title}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
              <div className="w-full max-w-md">
                {sent ? (
                  <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
                      <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                        Email Sent
                      </p>
                      <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                        Check your inbox
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-zinc-600">
                        We sent a reset link to{" "}
                        <span className="font-semibold text-zinc-800">{email}</span>.
                        It expires in 1 hour.
                      </p>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Didn&apos;t receive it? Check spam or{" "}
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
                    <div className="text-center lg:text-left">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
                        Password Recovery
                      </p>
                      <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
                        Forgot password?
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-zinc-600">
                        Enter your account email and we&apos;ll send you a reset link.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700">
                          Email Address
                        </label>
                        <div
                          className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                            emailError
                              ? "border-red-400 bg-red-50"
                              : "border-zinc-300 focus-within:border-pink-400"
                          }`}
                        >
                          <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                            placeholder="you@example.com"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                          />
                        </div>
                        {emailError && (
                          <p className="mt-2 text-xs text-red-500">{emailError}</p>
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
                            Sending reset link…
                          </span>
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>
                    </form>

                    <p className="mt-4 text-center text-[11px] leading-5 text-zinc-400 lg:text-left">
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
      </section>
    </main>
  );
}
