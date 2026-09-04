"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardTable from "@/components/DashboardTable";
import SyncStatusBadge from "@/components/SyncStatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { apiFetch } from "@/lib/api";
import { authHeaders, clearAuth, getAccessToken, getAuthUser } from "@/lib/auth";
import {
  mapApiMerchantProduct,
  mapSyncStatus,
  type ApiMerchant,
  type ApiProduct,
  type ApiSyncJob,
} from "@/lib/mappers";
import type { MerchantProduct, SyncJob } from "@/lib/types";
import type { ShopifyProductSyncResult, ShopifyStatus } from "@/lib/shopify";

export default function DashboardPage() {
  const router = useRouter();
  const [merchantName, setMerchantName] = useState("Your store");
  const [products, setProducts] = useState<MerchantProduct[]>([]);
  const [syncJob, setSyncJob] = useState<SyncJob | null>(null);
  const [shopify, setShopify] = useState<ShopifyStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const token = getAccessToken();
    const user = getAuthUser();
    if (!token || !user?.merchantId) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    if (reloadKey === 0) {
      setLoading(true);
    }
    setError(null);

    const headers = authHeaders();

    Promise.all([
      apiFetch<ApiMerchant>("/merchants/me", { headers }),
      apiFetch<ApiProduct[]>(`/merchants/${user.merchantId}/products`, {
        headers,
      }),
      apiFetch<ApiSyncJob[]>("/sync-jobs", { headers }),
      apiFetch<ShopifyStatus>("/shopify/status", { headers }).catch(
        () => null,
      ),
    ])
      .then(([merchant, merchantProducts, jobs, shopifyStatus]) => {
        if (cancelled) return;
        setMerchantName(merchant.businessName);
        setProducts(merchantProducts.map(mapApiMerchantProduct));
        setShopify(shopifyStatus);

        const latest = jobs[0];
        if (latest) {
          setSyncJob({
            id: latest.id,
            merchantName: merchant.businessName,
            status: mapSyncStatus(latest.status),
            lastSyncedAt:
              latest.completedAt ||
              latest.startedAt ||
              latest.createdAt ||
              new Date().toISOString(),
          });
        } else {
          setSyncJob(null);
        }
      })
      .catch((err: Error & { statusCode?: number }) => {
        if (cancelled) return;
        if (err.statusCode === 401) {
          clearAuth();
          router.replace("/login");
          return;
        }
        setError(err.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router, reloadKey]);

  const handleShopifySync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await apiFetch<ShopifyProductSyncResult>(
        "/shopify/sync/products",
        {
          method: "POST",
          headers: authHeaders(),
        },
      );
      setSyncMessage(
        `Synced ${result.productsProcessed} Shopify products (${result.productsCreated} new, ${result.productsUpdated} updated) from ${result.shop}.`,
      );
      setReloadKey((k) => k + 1);
    } catch (err) {
      setSyncMessage(
        err instanceof Error ? err.message : "Shopify sync failed",
      );
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((k) => k + 1)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {merchantName} — manage your connected store
          </p>
        </div>
        <Link
          href="/connect"
          className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:border-stone-400"
        >
          {shopify?.authenticated ? "Manage Shopify" : "Connect Shopify"}
        </Link>
      </div>

      {shopify && (
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-stone-900">
                Shopify{" "}
                {shopify.authenticated ? "connected" : "not connected"}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                {shopify.connection?.externalShopId ||
                  "Connect a store to import the live catalog."}
                {shopify.connection?.scopes?.length
                  ? ` · ${shopify.connection.scopes.join(", ")}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleShopifySync}
              disabled={!shopify.authenticated || syncing}
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {syncing ? "Syncing catalog..." : "Sync Shopify catalog"}
            </button>
          </div>
          {syncMessage && (
            <p className="mt-3 text-sm text-stone-600">{syncMessage}</p>
          )}
        </div>
      )}

      {syncJob && (
        <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-4">
          <span className="text-sm text-stone-600">Store sync status:</span>
          <SyncStatusBadge status={syncJob.status} />
          <span className="text-xs text-stone-400">
            Last synced{" "}
            {new Date(syncJob.lastSyncedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-900">
          Your Products
        </h2>
        <DashboardTable products={products} />
      </div>
    </div>
  );
}
