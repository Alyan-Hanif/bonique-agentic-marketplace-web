import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
            Bonique
          </Link>
          <nav className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/discover" className="hover:text-stone-900">
              Shop
            </Link>
            <Link href="/register?as=shop" className="hover:text-stone-900">
              Join
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
