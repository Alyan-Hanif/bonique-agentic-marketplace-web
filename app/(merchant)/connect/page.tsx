"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders, clearAuth, getAccessToken } from "@/lib/auth";

type ConnectState = "idle" | "loading" | "success" | "error";

interface StoreCardProps {
  name: string;
  provider: string;
  description: string;
  icon: string;
}

function StoreCard({ name, provider, description, icon }: StoreCardProps) {
  const [state, setState] = useState<ConnectState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setState("loading");
    setError(null);
    try {
      await apiFetch("/platform-connections/connect", {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider }),
      });
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
      setState("error");
    }
  };

  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white p-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-xl font-bold text-stone-700">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-stone-900">{name}</h3>
      <p className="mt-2 flex-1 text-sm text-stone-500">{description}</p>

      {state === "success" ? (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Store connected successfully!
        </div>
      ) : (
        <>
          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
          <button
            onClick={handleConnect}
            disabled={state === "loading"}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state === "loading" ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Connecting...
              </>
            ) : (
              `Connect ${name}`
            )}
          </button>
        </>
      )}
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
          Link your e-commerce platform to sync products automatically
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StoreCard
          name="Shopify"
          provider="shopify"
          description="Connect your Shopify store to import products, inventory, and variants in real time."
          icon="S"
        />
        <StoreCard
          name="Squarespace"
          provider="squarespace"
          description="Sync your Squarespace Commerce catalog and keep your Bonique listings up to date."
          icon="Sq"
        />
      </div>

      <p className="text-center text-xs text-stone-400">
        Calls the backend stub connect endpoint (OAuth not fully implemented
        yet).
      </p>
    </div>
  );
}
