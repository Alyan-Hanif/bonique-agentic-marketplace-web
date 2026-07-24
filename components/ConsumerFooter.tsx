import Link from "next/link";
import Logo from "@/components/Logo";

export default function ConsumerFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-800 bg-black text-neutral-400">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Logo height={48} />
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Curated streetwear and fashion from independent brands. Style that speaks for itself.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-accent">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/discover?category=new-arrivals" className="hover:text-accent">New Arrivals</Link></li>
            <li><Link href="/discover?category=men" className="hover:text-accent">Men</Link></li>
            <li><Link href="/discover?category=women" className="hover:text-accent">Women</Link></li>
            <li><Link href="/discover?category=sale" className="hover:text-accent">Sale</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-accent">Help</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><span className="cursor-default">Shipping &amp; Returns</span></li>
            <li><span className="cursor-default">Size Guide</span></li>
            <li><span className="cursor-default">Contact Us</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-accent">About</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><span className="cursor-default">Our Story</span></li>
            <li><span className="cursor-default">Sustainability</span></li>
            <li><span className="cursor-default">Careers</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6">
          <p className="text-xs text-neutral-600">&copy; 2026 Bonique. All rights reserved.</p>
          <Link href="/login" className="text-xs text-neutral-600 hover:text-neutral-500">
            Merchant Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
