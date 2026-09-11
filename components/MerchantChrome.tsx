import Link from "next/link";
import MerchantSignOut from "@/components/MerchantSignOut";

export default function MerchantChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-stone-900">
            Bonique
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
            <Link href="/dashboard" className="hover:text-stone-900">
              Dashboard
            </Link>
            <Link href="/dashboard/orders" className="hover:text-stone-900">
              Orders
            </Link>
            <Link href="/connect" className="hover:text-stone-900">
              Connect store
            </Link>
            <Link href="/account" className="hover:text-stone-900">
              Account
            </Link>
            <MerchantSignOut />
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-600">
              Merchant Portal
            </span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
