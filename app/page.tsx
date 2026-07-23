import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
          Bonique
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          A curated fashion marketplace connecting style-conscious shoppers with
          independent merchants.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/discover"
            className="rounded-full bg-stone-900 px-8 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-stone-800"
          >
            Shop as Consumer
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-stone-300 bg-white px-8 py-3 text-sm font-medium uppercase tracking-wider text-stone-900 transition-colors hover:border-stone-400"
          >
            Merchant Login
          </Link>
        </div>
      </div>
    </div>
  );
}
