import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#faf7fb]">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_480px] lg:items-center">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-100 p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Premium Non-Woven Bags
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Login and continue your bag shopping journey
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
              Explore stylish reusable bags, custom print options and premium
              packaging solutions for shops, gifting and businesses.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
