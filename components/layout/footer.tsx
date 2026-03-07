import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-pink-500"
            >
              Shree Shyam Bags
            </Link>

            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600">
              Premium non-woven bags for shops, boutiques, gifting brands,
              grocery stores and bulk business orders. Explore reusable, stylish
              and customizable bag solutions built for packaging and branding
              together.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-medium text-pink-600">
                Custom Printing
              </span>
              <span className="rounded-full bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700">
                Bulk Orders
              </span>
              <span className="rounded-full bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700">
                Eco Friendly
              </span>
              <span className="rounded-full bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700">
                Reusable Bags
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-900">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
              <Link href="/" className="transition hover:text-pink-500">
                Home
              </Link>
              <Link href="/products" className="transition hover:text-pink-500">
                Products
              </Link>
              <Link href="/about" className="transition hover:text-pink-500">
                About
              </Link>
              <Link href="/contact" className="transition hover:text-pink-500">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-900">
              Our Focus
            </h3>

            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <p>D-Cut Non-Woven Bags</p>
              <p>W-Cut Carry Bags</p>
              <p>Printed Business Bags</p>
              <p>Custom Bulk Orders</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6">
          <div className="flex flex-col gap-3 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
            <p>
              © 2026 Shree Shyam Bags. Premium non-woven bags for modern
              businesses.
            </p>

            <p>
              Stylish packaging. Reusable utility. Everyday brand visibility.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
