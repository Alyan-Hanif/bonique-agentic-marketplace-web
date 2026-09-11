"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { authHeaders, getAccessToken, getAuthUser, isSeller } from "@/lib/auth";
import { showToast } from "@/lib/toast";

interface FollowButtonProps {
  targetType: "user" | "merchant";
  targetId: string;
  following: boolean;
  onChange?: (following: boolean) => void;
  compact?: boolean;
}

export default function FollowButton({
  targetType,
  targetId,
  following,
  onChange,
  compact,
}: FollowButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [isFollowing, setIsFollowing] = useState(following);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const toggle = async () => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }
    if (isSeller(getAuthUser())) {
      showToast("Brand accounts can't follow shoppers.", "info");
      return;
    }
    setBusy(true);
    try {
      const result = await apiFetch<{ following: boolean }>("/social/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: authHeaders(),
        body: JSON.stringify({ targetType, targetId }),
      });
      setIsFollowing(result.following);
      onChange?.(result.following);
      showToast(result.following ? "Following" : "Unfollowed", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update follow", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`rounded-full font-bold uppercase tracking-widest transition duration-300 hover:scale-105 disabled:opacity-60 ${
        compact ? "px-3 py-1 text-[10px]" : "px-5 py-2 text-xs"
      } ${
        isFollowing
          ? "border border-neutral-300 text-neutral-700 hover:border-neutral-900"
          : "bg-neutral-900 text-white hover:bg-black"
      }`}
    >
      {busy ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
