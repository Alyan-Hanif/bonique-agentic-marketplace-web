"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders, getAuthUser, isSeller } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import FollowButton from "@/components/FollowButton";
import LookCarousel from "@/components/LookCarousel";
import ProductImage from "@/components/ProductImage";
import { BagIcon, CommentIcon, HeartIcon, ShareIcon } from "@/components/LookIcons";
import type { Cart } from "@/lib/commerce";
import { notifyCartUpdated } from "@/lib/cart-events";
import type { PublicLook } from "@/lib/social";
import { postLookComment, shareLook, toggleLookLike } from "@/lib/social-actions";
import { requireShopper } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";

export default function PublicLookPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lookId = params?.id;
  const [look, setLook] = useState<PublicLook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopping, setShopping] = useState(false);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const seller = isSeller(getAuthUser());

  const load = () =>
    apiFetch<PublicLook>(`/social/looks/${lookId}`, { headers: authHeaders() });

  useEffect(() => {
    if (!lookId) return;
    load()
      .then(setLook)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookId]);

  const like = async () => {
    if (!requireShopper(router) || !look) return;
    try {
      const result = await toggleLookLike(look.id);
      setLook((prev) =>
        prev ? { ...prev, likedByMe: result.liked, likeCount: result.likeCount } : prev,
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not like look", "error");
    }
  };

  const shopLook = async () => {
    if (!requireShopper(router)) return;
    setShopping(true);
    try {
      const result = await apiFetch<{
        added: number;
        skipped: string[];
        shopifyHandovers: Array<{ title: string; url: string | null }>;
        cart: Cart;
      }>(`/cart/from-look/${lookId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      notifyCartUpdated(result.cart.itemCount);
      const bits = [`${result.added} piece(s) added to cart`];
      if (result.skipped.length) {
        bits.push(`${result.skipped.length} custom item(s) skipped`);
      }
      showToast(bits.join(". "), result.added > 0 ? "success" : "info");
      if (result.added > 0) router.push("/cart");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not shop look", "error");
    } finally {
      setShopping(false);
    }
  };

  const postComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!requireShopper(router) || !lookId) return;
    const body = comment.trim();
    if (!body) return;
    setPosting(true);
    try {
      const created = await postLookComment(lookId, body);
      setLook((prev) =>
        prev
          ? {
              ...prev,
              comments: [created, ...prev.comments],
              commentCount: prev.commentCount + 1,
            }
          : prev,
      );
      setComment("");
      showToast("Comment posted", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not post comment", "error");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading look..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!look) return null;

  const name = look.author.displayName || look.author.username;
  const initial = (name.trim()[0] || "?").toUpperCase();
  const comments = look.comments ?? [];

  return (
    <div className="bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link href="/looks" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          ← Looks
        </Link>

        <div className="mt-4 overflow-hidden border border-neutral-200 bg-white lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
          <LookCarousel
            slides={
              look.slides?.length
                ? look.slides
                : look.items.map((item) => ({
                    slot: item.slot,
                    title: item.title,
                    imageUrl: item.imageUrl,
                  }))
            }
            lookTitle={look.title}
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
              <Link href={`/u/${look.author.username}`} className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
                  {look.author.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={look.author.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initial
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{name}</span>
                  <span className="block truncate text-xs text-neutral-400">@{look.author.username}</span>
                </span>
              </Link>
              {!look.isMine && !seller && (
                <div className="ml-auto">
                  <FollowButton
                    targetType="user"
                    targetId={look.author.id}
                    following={look.isFollowingAuthor}
                    compact
                  />
                </div>
              )}
            </div>

            <div className="flex min-h-0 flex-1 flex-col space-y-4 px-5 py-4">
              {look.caption && (
                <p className="text-sm leading-relaxed text-neutral-600">{look.caption}</p>
              )}

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Pieces</p>
                <ul className="mt-2 divide-y border-y border-neutral-100">
                  {look.items.map((item) => (
                    <li key={item.id} className="flex gap-3 py-2">
                      <div className="relative h-12 w-10 flex-shrink-0 bg-neutral-100">
                        {item.imageUrl && (
                          <ProductImage
                            src={item.imageUrl}
                            alt={item.title}
                            productId={item.productId ?? undefined}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.title}</p>
                        {item.shoppable && item.productId ? (
                          <Link href={`/product/${item.productId}`} className="text-xs text-neutral-500 underline">
                            View product
                          </Link>
                        ) : (
                          <p className="text-xs text-neutral-400">Custom piece</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-h-[10rem] flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Comments · {look.commentCount}
                </p>
                <ul className="mt-3 max-h-56 space-y-3 overflow-y-auto">
                  {comments.map((entry) => (
                    <li key={entry.id}>
                      <Link
                        href={`/u/${entry.author.username}`}
                        className="text-sm font-semibold hover:underline"
                      >
                        {entry.author.displayName || entry.author.username}
                      </Link>{" "}
                      <span className="text-sm text-neutral-700">{entry.body}</span>
                    </li>
                  ))}
                  {comments.length === 0 && (
                    <li className="text-sm text-neutral-400">No comments yet. Be the first.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="border-t border-neutral-100 px-5 py-4">
              {seller ? (
                <p className="text-sm text-neutral-500">
                  Brand accounts can preview looks. Like, comment, and shop stay on shopper accounts.
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => void like()}
                      className={look.likedByMe ? "text-red-500" : "text-neutral-900 hover:text-neutral-500"}
                      aria-label={look.likedByMe ? "Unlike" : "Like"}
                    >
                      <HeartIcon filled={look.likedByMe} />
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById(`look-comment-${look.id}`)?.focus()}
                      className="text-neutral-900 hover:text-neutral-500"
                      aria-label="Comment"
                    >
                      <CommentIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => void shareLook(look.id, look.title)}
                      className="text-neutral-900 hover:text-neutral-500"
                      aria-label="Share"
                    >
                      <ShareIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => void shopLook()}
                      disabled={shopping || look.items.length === 0}
                      className="ml-auto flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-50"
                    >
                      <BagIcon className="h-4 w-4" />
                      {shopping ? "Adding..." : "Shop look"}
                    </button>
                  </div>
                  <p className="mt-2 text-sm font-semibold">
                    {look.likeCount} {look.likeCount === 1 ? "like" : "likes"}
                  </p>
                  <form onSubmit={postComment} className="mt-3 flex items-center gap-2 border-t border-neutral-100 pt-3">
                    <input
                      id={`look-comment-${look.id}`}
                      required
                      minLength={1}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    />
                    <button
                      type="submit"
                      disabled={posting || !comment.trim()}
                      className="text-sm font-semibold text-neutral-900 disabled:text-neutral-300"
                    >
                      {posting ? "..." : "Post"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
