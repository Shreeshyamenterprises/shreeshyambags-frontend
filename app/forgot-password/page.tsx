export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf7fb] px-4">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
          Forgot Password
        </p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-900">
          Reset your password
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Add your email or phone recovery flow here.
        </p>
      </div>
    </main>
  );
}
