"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, getAuthUser, isSeller } from "@/lib/auth";
import { showToast } from "@/lib/toast";

/** Returns false if the user should log in or is a brand account. */
export function requireShopper(router: { push: (href: string) => void }): boolean {
  if (!getAccessToken()) {
    router.push("/login");
    return false;
  }
  if (isSeller(getAuthUser())) {
    showToast("Brand accounts stay in the merchant portal.", "info");
    return false;
  }
  return true;
}

/** Shopper-only pages. Brand accounts are sent to the dashboard. */
export function useBuyerOnly() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(getAccessToken()) && !isSeller(getAuthUser());
  });

  useEffect(() => {
    const token = getAccessToken();
    const user = getAuthUser();
    if (!token) {
      setAllowed(false);
      router.replace("/login");
      return;
    }
    if (isSeller(user)) {
      setAllowed(false);
      showToast("Brand accounts stay in the merchant portal.", "info");
      router.replace("/dashboard");
      return;
    }
    setAllowed(true);
  }, [router]);

  return allowed;
}

/** Public shopper pages that brands should not use (looks feed). */
export function useBlockSellers() {
  const router = useRouter();
  const [ready, setReady] = useState(true);

  useEffect(() => {
    if (isSeller(getAuthUser())) {
      setReady(false);
      showToast("Brand accounts stay in the merchant portal.", "info");
      router.replace("/dashboard");
    }
  }, [router]);

  return ready;
}

/** Brand-only pages. Shoppers are sent to their account. */
export function useSellerOnly() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(getAccessToken()) && isSeller(getAuthUser());
  });

  useEffect(() => {
    const token = getAccessToken();
    const user = getAuthUser();
    if (!token) {
      setAllowed(false);
      router.replace("/login");
      return;
    }
    if (!isSeller(user)) {
      setAllowed(false);
      showToast("That's a brand account area.", "info");
      router.replace("/account");
      return;
    }
    setAllowed(true);
  }, [router]);

  return allowed;
}
