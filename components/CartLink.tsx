"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { authHeaders, getAccessToken } from "@/lib/auth";
import type { Cart } from "@/lib/commerce";
import { CART_UPDATED_EVENT } from "@/lib/cart-events";

export default function CartLink() {
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      setCount(0);
      return;
    }
    apiFetch<Cart>("/cart", { headers: authHeaders() })
      .then((cart) => setCount(cart.itemCount))
      .catch(() => setCount(0));
  }, []);

  useEffect(() => {
    const onUpdate = (event: Event) => {
      const itemCount = (event as CustomEvent<{ itemCount: number }>).detail
        ?.itemCount;
      if (typeof itemCount === "number") {
        setCount(itemCount);
        setBump(true);
      }
    };
    window.addEventListener(CART_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
  }, []);

  return (
    <Link
      id="header-cart-icon"
      href="/cart"
      className={`relative text-neutral-300 transition-colors hover:text-accent ${bump ? "cart-bump" : ""}`}
      aria-label={count === 1 ? "Cart, 1 item" : `Cart, ${count} items`}
      onAnimationEnd={() => setBump(false)}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
        />
      </svg>
      {count > 0 && (
        <span
          aria-live="polite"
          className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-black"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
