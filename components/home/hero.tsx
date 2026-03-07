import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-[-80px] top-[-80px] h-64 w-64 rounded-full bg-pink-200 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-80px] h-72 w-72 rounded-full bg-fuchsia-200 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-rose-100 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="inline-flex items-center rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-600 shadow-sm backdrop-blur">
            Custom Non Woven Bags
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Premium Bags for
            <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
              Modern Brands & Shops
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg lg:mx-0">
            Stylish, eco-friendly and customizable non woven bags in different
            sizes, colors and shapes. Perfect for boutiques, grocery stores,
            sweet shops and gifting businesses.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-pink-600"
            >
              Explore Collection
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-800 backdrop-blur transition hover:bg-white"
            >
              Contact Us
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/70 p-4 text-left shadow-sm ring-1 ring-white/60 backdrop-blur">
              <p className="text-2xl font-bold text-zinc-900">100%</p>
              <p className="mt-1 text-sm text-zinc-600">Customizable styles</p>
            </div>

            <div className="rounded-2xl bg-white/70 p-4 text-left shadow-sm ring-1 ring-white/60 backdrop-blur">
              <p className="text-2xl font-bold text-zinc-900">Multi</p>
              <p className="mt-1 text-sm text-zinc-600">Size & color options</p>
            </div>

            <div className="rounded-2xl bg-white/70 p-4 text-left shadow-sm ring-1 ring-white/60 backdrop-blur">
              <p className="text-2xl font-bold text-zinc-900">Eco</p>
              <p className="mt-1 text-sm text-zinc-600">Reusable bag range</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="mx-auto max-w-md rounded-[2rem] bg-white/70 p-4 shadow-2xl ring-1 ring-white/60 backdrop-blur sm:max-w-lg lg:ml-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-pink-200 to-rose-100 p-4 shadow-sm">
                <div className="flex h-44 items-center justify-center rounded-[1.25rem] border border-white/60 bg-white/70 text-center text-sm font-semibold text-zinc-700 sm:h-52">
                  D-Cut Bags
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-gradient-to-br from-fuchsia-200 to-pink-100 p-4 shadow-sm">
                <div className="flex h-44 items-center justify-center rounded-[1.25rem] border border-white/60 bg-white/70 text-center text-sm font-semibold text-zinc-700 sm:h-52">
                  W-Cut Bags
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-gradient-to-br from-rose-100 to-pink-50 p-4 shadow-sm">
                <div className="flex h-44 items-center justify-center rounded-[1.25rem] border border-white/60 bg-white/70 text-center text-sm font-semibold text-zinc-700 sm:h-52">
                  Printed Bags
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-gradient-to-br from-pink-100 to-fuchsia-50 p-4 shadow-sm">
                <div className="flex h-44 items-center justify-center rounded-[1.25rem] border border-white/60 bg-white/70 text-center text-sm font-semibold text-zinc-700 sm:h-52">
                  Custom Orders
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
