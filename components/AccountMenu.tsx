"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getAuthUser, isSeller, type AuthUser } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function AccountMenu() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = getAuthUser();
    setUser(current);
    if (current?.username) router.prefetch(`/u/${current.username}`);
    router.prefetch("/account");
    router.prefetch("/wardrobe");
    router.prefetch("/orders");
  }, [router]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest">
        <Link href="/login" className="text-neutral-300 hover:text-accent">
          Sign in
        </Link>
        <Link
          href="/register?as=shop"
          className="rounded-full bg-accent px-3 py-1.5 text-black hover:bg-accent-dark"
        >
          Join
        </Link>
      </div>
    );
  }

  const seller = isSeller(user);
  const label = user.displayName || user.username || "Account";
  const itemClass =
    "block px-4 py-2 text-neutral-200 hover:bg-neutral-900 hover:text-accent";

  const signOut = () => {
    clearAuth();
    setConfirmOpen(false);
    setOpen(false);
    setUser(null);
    showToast("Signed out", "info");
    router.push(seller ? "/login" : "/");
  };

  return (
    <>
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="max-w-[9rem] truncate text-xs font-semibold uppercase tracking-widest text-neutral-300 hover:text-accent"
        aria-expanded={open}
      >
        {label}
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-48 rounded-lg border border-neutral-800 bg-black py-2 text-sm shadow-xl">
          <Link href="/account" onClick={() => setOpen(false)} className={itemClass}>
            Account
          </Link>
          {seller ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className={itemClass}>
                Dashboard
              </Link>
              <Link href="/connect" onClick={() => setOpen(false)} className={itemClass}>
                Connect store
              </Link>
            </>
          ) : (
            <>
              {user.username && (
                <Link
                  href={`/u/${user.username}`}
                  onClick={() => setOpen(false)}
                  className={itemClass}
                >
                  Profile
                </Link>
              )}
              <Link href="/wardrobe" onClick={() => setOpen(false)} className={itemClass}>
                Wardrobe
              </Link>
              <Link href="/orders" onClick={() => setOpen(false)} className={itemClass}>
                Orders
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setConfirmOpen(true);
            }}
            className="block w-full px-4 py-2 text-left text-neutral-200 hover:bg-neutral-900 hover:text-accent"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
    {confirmOpen && (
      <ConfirmModal
        title="Sign out?"
        description="You’ll need to sign in again to access your account."
        confirmLabel="Sign out"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={signOut}
      />
    )}
    </>
  );
}
