"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import {
  normalizeShopDomain,
  type ShopifyConnectStart,
  type ShopifyStatus,
} from "@/lib/shopify";
import { useSellerOnly } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";
import LoadingSpinner from "@/components/LoadingSpinner";

function OAuthToasts() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const shopify = searchParams.get("shopify");
    const shop = searchParams.get("shop");
    const message = searchParams.get("message");
    if (shopify === "connected") {
      showToast(
        shop ? `Shopify connected for ${shop}` : "Shopify connected",
        "success",
      );
      router.replace("/connect");
    } else if (shopify === "error") {
      showToast(message || "Shopify authorization failed.", "error");
      router.replace("/connect");
    }
  }, [searchParams, router]);

  return null;
}

function ShopifyConnectCard() {
  const [status, setStatus] = useState<ShopifyStatus | null>(null);
  const [shop, setShop] = useState("");
  const [loading, setLoading] = useState(false);

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
        if (!cancelled) {
          showToast(err.message || "Could not load Shopify status", "error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const connected = Boolean(status?.authenticated && status.connection);

  const handleConnect = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      showToast(
        err instanceof Error ? err.message : "Connection failed",
        "error",
      );
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
  const allowed = useSellerOnly();

  if (!allowed) {
    return <LoadingSpinner label="Loading..." />;
  }

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
        <OAuthToasts />
      </Suspense>

      <div className="max-w-xl">
        <ShopifyConnectCard />
      </div>
    </div>
  );
}
