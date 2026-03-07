"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export function SignupForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        name,
        email,
        phone: phone || undefined,
        password,
      });

      login(res.data.token);
      router.push("/products");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-zinc-100 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
          Join Us
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
          Create an account and explore premium non-woven bags
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Sign up to manage your orders, save your shopping flow and discover
          stylish reusable non-woven bags with customization options for every
          need.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Name
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Phone
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-pink-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-pink-500 hover:text-pink-600"
        >
          Login here
        </Link>
      </p>
    </div>
  );
}
