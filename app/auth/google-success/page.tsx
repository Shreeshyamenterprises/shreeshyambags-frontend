"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setToken(token);
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7fb]">
      <div className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-zinc-100">
        Signing you in with Google...
      </div>
    </main>
  );
}
