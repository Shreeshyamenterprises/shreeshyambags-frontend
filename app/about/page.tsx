import Link from "next/link";

const highlights = [
  "Custom printed non-woven bags for businesses",
  "Stylish, reusable and eco-friendly packaging",
  "Bulk order support for shops and brands",
  "Multiple sizes, shapes and color options",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              About Shree Shyam Bags
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Premium non-woven bags made for modern brands, shops and
              businesses
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              We create stylish, practical and customizable non-woven bags for
              boutiques, grocery stores, sweet shops, gifting brands and bulk
              buyers. Our goal is simple — help businesses use packaging that
              looks premium, feels useful and promotes their brand every day.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Our Vision
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
              Bags that do packaging + branding together
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              A good non-woven bag is not just for carrying products. It is also
              a moving advertisement for your store. When a customer carries
              your printed bag, your brand gets noticed again and again. That is
              why we focus on bags that are reusable, aesthetic and
              brand-friendly.
            </p>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Whether you need D-cut bags, W-cut bags, printed bags or bulk
              custom orders, our collection is built around business utility and
              young modern visual appeal.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Why Customers Choose Us
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] bg-zinc-50 p-5 ring-1 ring-zinc-100"
                >
                  <div className="mb-3 h-3 w-3 rounded-full bg-pink-500" />
                  <p className="text-sm font-medium leading-6 text-zinc-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-zinc-900 px-6 py-12 text-center text-white sm:px-10 lg:px-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">
              Non-Woven Bags for Every Need
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Stylish. Reusable. Customizable. Brand-ready.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              Explore our premium non-woven bag collection and find the right
              size, style and custom print setup for your business.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Explore Bags
              </Link>

              <Link
                href="/contact"
                className="inline-flex rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
