"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders, getAuthUser, isSeller, type AuthUser } from "@/lib/auth";
import ErrorMessage from "@/components/ErrorMessage";
import FollowButton from "@/components/FollowButton";
import LookGrid from "@/components/LookGrid";
import type { SocialProfile } from "@/lib/social";

function profileFromLocalUser(username: string, me: AuthUser | null): SocialProfile | null {
  if (!me?.username || me.username !== username) return null;
  return {
    user: {
      id: me.id,
      username: me.username,
      displayName: me.displayName,
      email: me.email,
      avatarUrl: me.avatarUrl,
      bio: me.bio,
    },
    shop: null,
    followerCount: 0,
    followingCount: 0,
    isFollowing: false,
    isMe: true,
    looks: [],
  };
}

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;
  const [profile, setProfile] = useState<SocialProfile | null>(() =>
    username ? profileFromLocalUser(username, getAuthUser()) : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [looksLoading, setLooksLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    setLooksLoading(true);
    apiFetch<SocialProfile>(`/social/profiles/${username}`, {
      headers: authHeaders(),
    })
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLooksLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (error && !profile) return <ErrorMessage message={error} />;

  const name = profile?.user.displayName || profile?.user.username || username || "Profile";
  const seller = isSeller(getAuthUser());
  const initial = (name.trim()[0] || "?").toUpperCase();

  return (
    <div className="page-shell">
      <div className="flex gap-6 sm:gap-10">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-2xl font-serif font-semibold text-neutral-700 ring-1 ring-neutral-200 sm:h-28 sm:w-28">
          {profile?.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.user.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
            {profile && !profile.isMe && !seller && (
              <FollowButton
                targetType="user"
                targetId={profile.user.id}
                following={profile.isFollowing}
                onChange={(following) =>
                  setProfile((prev) =>
                    prev
                      ? {
                          ...prev,
                          isFollowing: following,
                          followerCount: prev.followerCount + (following ? 1 : -1),
                        }
                      : prev,
                  )
                }
              />
            )}
            {profile?.isMe && (
              <Link href="/wardrobe/looks" className="ui-btn-ghost text-xs uppercase tracking-wider">
                My looks
              </Link>
            )}
          </div>
          {profile?.user.email && (
            <p className="mt-1 text-sm text-neutral-500">{profile.user.email}</p>
          )}
          <p className="mt-0.5 text-sm text-neutral-500">@{username}</p>
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span>
              <strong>{profile?.looks.length ?? "—"}</strong> looks
            </span>
            <span>
              <strong>{profile?.followerCount ?? "—"}</strong> followers
            </span>
            <span>
              <strong>{profile?.followingCount ?? "—"}</strong> following
            </span>
          </p>
          {profile?.user.bio && (
            <p className="mt-3 max-w-lg text-sm text-neutral-600">{profile.user.bio}</p>
          )}
          {profile?.shop && (
            <Link
              href={`/shops/${profile.shop.slug}`}
              className="mt-2 inline-block text-xs font-semibold uppercase tracking-wider underline"
            >
              Shop {profile.shop.businessName}
            </Link>
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-neutral-200 pt-8">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Looks
        </p>
        {looksLoading && (!profile || profile.looks.length === 0) ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-neutral-200" />
            ))}
          </div>
        ) : profile?.looks.length ? (
          <LookGrid looks={profile.looks} />
        ) : (
          <p className="py-10 text-center text-sm text-neutral-500">No published looks yet.</p>
        )}
      </div>
    </div>
  );
}
