import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 text-center">
      <h1 className="text-4xl font-semibold text-stone-900">404</h1>
      <p className="mt-2 text-stone-600">This page could not be found.</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
      >
        Go Home
      </Link>
    </div>
  );
}
