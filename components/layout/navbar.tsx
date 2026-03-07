"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const count = useCartStore((s) => s.count);

  const loggedIn = useAuthStore((s) => s.loggedIn);
  const load = useAuthStore((s) => s.load);
  const logout = useAuthStore((s) => s.logout);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-pink-500 sm:text-xl"
        >
          Shree Shyam Bags
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 transition hover:text-pink-500"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-700 transition hover:text-pink-500"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-zinc-700 transition hover:text-pink-500"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-zinc-700 transition hover:text-pink-500"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-700 transition hover:text-pink-500"
              >
                Account
              </Link>
              <Link
                href="/orders"
                className="text-sm font-medium text-zinc-700 transition hover:text-pink-500"
              >
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-zinc-700 transition hover:text-pink-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-700 transition hover:text-pink-500"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
              >
                Sign Up
              </Link>
            </>
          )}

          <Link
            href="/cart"
            className="relative rounded-full p-2 transition hover:bg-zinc-100"
          >
            <ShoppingBag className="h-5 w-5 text-zinc-800" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="relative rounded-full p-2 transition hover:bg-zinc-100"
          >
            <ShoppingBag className="h-5 w-5 text-zinc-800" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-xs text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full p-2 transition hover:bg-zinc-100"
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="h-5 w-5 text-zinc-800" />
            ) : (
              <Menu className="h-5 w-5 text-zinc-800" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Products
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Contact
            </Link>

            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Account
                </Link>
                <Link
                  href="/orders"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-xl px-3 py-3 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="mt-2 rounded-full bg-pink-500 px-4 py-3 text-center text-sm font-medium text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
