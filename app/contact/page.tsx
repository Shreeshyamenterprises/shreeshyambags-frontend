import Link from "next/link";

const contactCards = [
  {
    title: "Bulk Orders",
    text: "Get support for wholesale quantities, repeat orders and custom business requirements.",
  },
  {
    title: "Custom Printing",
    text: "Add your shop name, logo or brand message to non-woven bags for everyday marketing.",
  },
  {
    title: "Bag Selection Help",
    text: "Need help choosing D-cut, W-cut, printed or other styles? We can guide you.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="border-b border-zinc-200/70 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Contact Us
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Let’s build the right non-woven bag solution for your business
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Whether you need premium printed bags, retail carry bags or large
              bulk orders, we’re here to help you choose the right style, size,
              color and branding options.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Get in Touch
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
              We help shops and brands grow with better packaging
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-600">
              A printed non-woven bag is more than packaging — it keeps
              promoting your business after the purchase too. That’s why our
              contact and custom order support is focused on both style and
              brand impact.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {contactCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] bg-zinc-50 p-5 ring-1 ring-zinc-100"
                >
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Contact Details
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-zinc-50 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Business Focus
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Premium Non-Woven Bags
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Custom printed bags, reusable carry bags, retail packaging and
                  bulk orders for businesses.
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Message
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  For pricing, customization and wholesale inquiries, please
                  connect with us and share your bag requirements.
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Explore Before Contacting
                </p>
                <Link
                  href="/products"
                  className="mt-2 inline-flex text-sm font-semibold text-pink-500 hover:text-pink-600"
                >
                  Browse product collection →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
