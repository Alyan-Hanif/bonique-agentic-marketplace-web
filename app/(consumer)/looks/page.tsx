"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import LookPost from "@/components/LookPost";
import LookGrid from "@/components/LookGrid";
import type { FeedResponse, LookCard } from "@/lib/social";
import { useBlockSellers } from "@/lib/use-buyer-only";

export default function LooksSocialPage() {
  const ready = useBlockSellers();
  const [tab, setTab] = useState<"following" | "explore">("following");
  const [data, setData] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiFetch<FeedResponse>(`/social/feed?tab=${tab}`, { headers: authHeaders() })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, ready]);

  const patchLook = (next: LookCard) => {
    setData((prev) =>
      prev
        ? { ...prev, looks: prev.looks.map((look) => (look.id === next.id ? next : look)) }
        : prev,
    );
  };

  const patchFollow = (authorId: string, following: boolean) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            looks: prev.looks.map((look) =>
              look.author.id === authorId ? { ...look, isFollowingAuthor: following } : look,
            ),
          }
        : prev,
    );
  };

  if (!ready) return null;

  const tabClass = (active: boolean) =>
    `pb-1 text-sm font-semibold transition duration-300 ${
      active
        ? "border-b-2 border-neutral-900 text-neutral-900"
        : "border-b-2 border-transparent text-neutral-400 hover:text-neutral-700"
    }`;

  return (
    <div className="min-h-[70vh] bg-neutral-50">
      <nav
        className="fixed left-0 right-0 z-[45] border-b border-neutral-200 bg-white"
        style={{ top: "var(--consumer-header-height, 4rem)" }}
      >
        <div className="mx-auto flex h-12 max-w-xl items-center justify-center gap-8 px-4">
          <button
            type="button"
            onClick={() => setTab("following")}
            className={tabClass(tab === "following")}
          >
            Following
          </button>
          <button
            type="button"
            onClick={() => setTab("explore")}
            className={tabClass(tab === "explore")}
          >
            Explore
          </button>
          <Link href="/wardrobe/looks" className={tabClass(false)}>
            Create
          </Link>
        </div>
      </nav>
      <div className="h-12" aria-hidden />

      <div className="mx-auto max-w-xl space-y-6 px-4 py-6">
        {data?.fallback && tab === "following" && !loading && (
          <p className="text-sm text-neutral-500">
            You are not following anyone with looks yet — here is Explore instead. Open a profile
            and tap Follow to build your feed.
          </p>
        )}

        {loading && (
          <div className="py-16">
            <LoadingSpinner label="Loading looks..." />
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && data && data.looks.length === 0 && (
          <div className="py-16 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Looks</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Nobody has published a look yet. Build one from your wardrobe and tap Publish.
            </p>
            <Link
              href="/wardrobe/looks"
              className="mt-6 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-white"
            >
              Create a look
            </Link>
          </div>
        )}

        {!loading && !error && data && data.looks.length > 0 && tab === "following" && (
          <div className="stagger-in space-y-6">
            {data.looks.map((look) => (
              <LookPost key={look.id} look={look} onChange={patchLook} onFollowAuthor={patchFollow} />
            ))}
          </div>
        )}

        {!loading && !error && data && data.looks.length > 0 && tab === "explore" && (
          <LookGrid looks={data.looks} />
        )}
      </div>
    </div>
  );
}
