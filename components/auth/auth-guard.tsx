"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const loggedIn = useAuthStore((s) => s.loggedIn);
  const load = useAuthStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !loggedIn) {
      router.push("/login");
    }
  }, [loggedIn, router]);

  if (
    !loggedIn &&
    typeof window !== "undefined" &&
    !localStorage.getItem("token")
  ) {
    return null;
  }

  return <>{children}</>;
}
