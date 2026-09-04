"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders, clearAuth, getAccessToken } from "@/lib/auth";
import {
  normalizeShopDomain,
  type ShopifyConnectStart,
  type ShopifyStatus,
} from "@/lib/shopify";

function OAuthBanner() {
  const searchParams = useSearchParams();
  const shopify = searchParams.get("shopify");
  const shop = searchParams.get("shop");
  const message = searchParams.get("message");

  if (shopify === "connected") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Shopify connected{shop ? ` for ${shop}` : ""}. You can sync the catalog
        from the dashboard.
      </div>
    );
  }

  if (shopify === "error") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {message || "Shopify authorization failed."}
      </div>
    );
  }

  return null;
}

function ShopifyConnectCard() {
  const [status, setStatus] = useState<ShopifyStatus | null>(null);
  const [shop, setShop] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<ShopifyStatus>("/shopify/status", { headers: authHeaders() })
      .then((data) => {
        if (cancelled) return;
        setStatus(data);
        if (data.connection?.externalShopId) {
          setShop(data.connection.externalShopId);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const connected = Boolean(status?.authenticated && status.connection);

  const handleConnect = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const normalized = normalizeShopDomain(shop);
      const result = await apiFetch<ShopifyConnectStart>(
        "/platform-connections/connect",
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ provider: "shopify", shop: normalized }),
        },
      );
      if (!result.authorizeUrl) {
        throw new Error("Shopify did not return an authorize URL");
      }
      window.location.href = result.authorizeUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white p-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-xl font-bold text-stone-700">
        S
      </div>
      <h3 className="text-lg font-semibold text-stone-900">Shopify</h3>
      <p className="mt-2 text-sm text-stone-500">
        Authorize your Shopify store so Bonique can import products, variants,
        and inventory.
      </p>

      {connected && status?.connection && (
        <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Connected to{" "}
          <span className="font-medium">
            {status.connection.externalShopId}
          </span>
        </div>
      )}

      <form onSubmit={handleConnect} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="shop"
            className="block text-sm font-medium text-stone-700"
          >
            Shop domain
          </label>
          <input
            id="shop"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            required
            placeholder="your-store.myshopify.com"
            className="mt-1 w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || !shop.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? "Redirecting to Shopify..."
            : connected
              ? "Reconnect Shopify"
              : "Connect Shopify"}
        </button>
      </form>
    </div>
  );
}

export default function ConnectPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getAccessToken()) {
      clearAuth();
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-stone-500 transition-colors hover:text-stone-900"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-stone-900 md:text-3xl">
          Connect Your Store
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Link Shopify to sync products into Bonique
        </p>
      </div>

      <Suspense fallback={null}>
        <OAuthBanner />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <ShopifyConnectCard />
        <div className="flex flex-col rounded-lg border border-stone-200 bg-white p-8 opacity-70">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-xl font-bold text-stone-700">
            Sq
          </div>
          <h3 className="text-lg font-semibold text-stone-900">Squarespace</h3>
          <p className="mt-2 flex-1 text-sm text-stone-500">
            Squarespace is not wired yet. Shopify is the supported integration.
          </p>
          <button
            disabled
            className="mt-6 rounded-full border border-stone-200 py-3 text-sm font-medium uppercase tracking-wider text-stone-400"
          >
            Coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
