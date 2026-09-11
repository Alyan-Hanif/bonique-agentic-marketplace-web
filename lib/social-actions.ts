import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import type { LookComment } from "@/lib/social";

export function lookUrl(lookId: string) {
  if (typeof window === "undefined") return `/looks/${lookId}`;
  return `${window.location.origin}/looks/${lookId}`;
}

export async function toggleLookLike(lookId: string) {
  return apiFetch<{ liked: boolean; likeCount: number }>(
    `/social/looks/${lookId}/like`,
    { method: "POST", headers: authHeaders() },
  );
}

export async function postLookComment(lookId: string, body: string) {
  return apiFetch<LookComment>(`/social/looks/${lookId}/comments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ body: body.trim() }),
  });
}

export async function shareLook(lookId: string, title: string) {
  const url = lookUrl(lookId);
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: title || "Look on Bonique", text: title, url });
      return;
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return;
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast("Link copied", "success");
  } catch {
    showToast(url, "info");
  }
}
