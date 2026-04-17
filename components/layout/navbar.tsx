"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api";

function NavLink({
  href,
  children,
  pathname,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
}) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`group relative rounded-full px-3 py-2 text-sm font-medium transition duration-300 ${
        isActive
          ? "bg-pink-50 text-pink-600 shadow-sm ring-1 ring-pink-100"
          : "text-zinc-700 hover:bg-zinc-50 hover:text-pink-500"
      }`}
    >
      <span>{children}</span>
      <span
        className={`absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-pink-500 transition-all duration-300 ${
          isActive ? "w-8" : "w-0 group-hover:w-8"
        }`}
      />
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  pathname,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
  onClick: () => void;
}) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-xl px-3 py-3 text-sm font-medium transition duration-300 ${
        isActive
          ? "bg-pink-50 text-pink-600 ring-1 ring-pink-100"
          : "text-zinc-700 hover:bg-zinc-50 hover:text-pink-500"
      }`}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const count    = useCartStore((s) => s.count);
  const setCount = useCartStore((s) => s.setCount);

  const loggedIn = useAuthStore((s) => s.loggedIn);
  const token    = useAuthStore((s) => s.token);
  const load     = useAuthStore((s) => s.load);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Decode role from JWT payload without a library
  const isAdmin = (() => {
    try {
      if (!token) return false;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.role === "ADMIN";
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    load();
  }, [load]);

  // Sync cart count on app load once auth is resolved
  useEffect(() => {
    if (!loggedIn) return;
    api.get("/cart")
      .then((res) => setCount((res.data?.items ?? []).length))
      .catch(() => {});
  }, [loggedIn, setCount]);

  // Close mobile menu on click outside or Escape key
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  if (hideNavbar) {
    return null;
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header ref={menuRef} className="sticky top-0 z-50 border-b border-white/30 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-2xl">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={closeMenu}
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-pink-200">
            <Image
              src="/logo.png"
              alt="Shreeshyam Packaging Logo"
              fill
              className="object-contain p-1.5 transition duration-300 group-hover:scale-105"
              priority
            />
          </div>

          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-pink-500 sm:text-xs">
              Premium Bag Manufacturer
            </p>
            <h1 className="text-base font-bold tracking-tight text-zinc-900 transition duration-300 group-hover:text-pink-600 sm:text-lg lg:text-xl">
              Shreeshyam Packaging
            </h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 lg:flex">
          <NavLink href="/" pathname={pathname}>
            Home
          </NavLink>
          <NavLink href="/products" pathname={pathname}>
            Products
          </NavLink>
          <NavLink href="/about" pathname={pathname}>
            About
          </NavLink>
          <NavLink href="/contact" pathname={pathname}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {loggedIn ? (
            <>
              {isAdmin && (
                <NavLink href="/admin" pathname={pathname}>
                  Admin
                </NavLink>
              )}
              <NavLink href="/dashboard" pathname={pathname}>
                Account
              </NavLink>
              <NavLink href="/orders" pathname={pathname}>
                My Orders
              </NavLink>
            </>
          ) : (
            <>
              <NavLink href="/login" pathname={pathname}>
                Login
              </NavLink>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}

          <Link
            href="/cart"
            className={`group relative rounded-full p-2.5 transition duration-300 hover:-translate-y-0.5 ${
              pathname === "/cart"
                ? "bg-pink-50 ring-1 ring-pink-100"
                : "hover:bg-zinc-100"
            }`}
          >
            <ShoppingBag
              className={`h-5 w-5 transition duration-300 ${
                pathname === "/cart"
                  ? "text-pink-600"
                  : "text-zinc-800 group-hover:text-pink-600"
              }`}
            />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-xs text-white shadow-sm">
                {count}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/cart"
            className={`group relative rounded-full p-2 transition duration-300 ${
              pathname === "/cart" ? "bg-pink-50" : "hover:bg-zinc-100"
            }`}
          >
            <ShoppingBag
              className={`h-5 w-5 transition duration-300 ${
                pathname === "/cart"
                  ? "text-pink-600"
                  : "text-zinc-800 group-hover:text-pink-600"
              }`}
            />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-xs text-white shadow-sm">
                {count}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full p-2 transition duration-300 hover:bg-zinc-100"
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

      <div
        className={`overflow-hidden border-t border-zinc-200 bg-white transition-all duration-300 lg:hidden ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="mb-4 rounded-[1.5rem] bg-gradient-to-r from-pink-50 via-rose-50 to-fuchsia-50 p-4 shadow-sm ring-1 ring-pink-100">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
              Shreeshyam Packaging
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Premium non-woven bags for bulk orders, daily business packaging
              and reusable brand visibility.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <MobileNavLink href="/" pathname={pathname} onClick={closeMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink
              href="/products"
              pathname={pathname}
              onClick={closeMenu}
            >
              Products
            </MobileNavLink>
            <MobileNavLink
              href="/about"
              pathname={pathname}
              onClick={closeMenu}
            >
              About
            </MobileNavLink>
            <MobileNavLink
              href="/contact"
              pathname={pathname}
              onClick={closeMenu}
            >
              Contact
            </MobileNavLink>

            {loggedIn ? (
              <>
                {isAdmin && (
                  <MobileNavLink href="/admin" pathname={pathname} onClick={closeMenu}>
                    Admin Panel
                  </MobileNavLink>
                )}
                <MobileNavLink
                  href="/dashboard"
                  pathname={pathname}
                  onClick={closeMenu}
                >
                  Account
                </MobileNavLink>
                <MobileNavLink
                  href="/orders"
                  pathname={pathname}
                  onClick={closeMenu}
                >
                  My Orders
                </MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink
                  href="/login"
                  pathname={pathname}
                  onClick={closeMenu}
                >
                  Login
                </MobileNavLink>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="mt-2 rounded-full bg-zinc-900 px-4 py-3 text-center text-sm font-medium text-white shadow-sm transition duration-300 hover:bg-zinc-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
