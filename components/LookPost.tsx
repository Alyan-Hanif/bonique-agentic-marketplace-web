"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FollowButton from "@/components/FollowButton";
import LookCarousel from "@/components/LookCarousel";
import { HeartIcon, CommentIcon, ShareIcon, BagIcon } from "@/components/LookIcons";
import { getAuthUser } from "@/lib/auth";
import { postLookComment, shareLook, toggleLookLike } from "@/lib/social-actions";
import { requireShopper } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";
import type { LookCard, LookComment, LookSlide } from "@/lib/social";

function Avatar({ name, src }: { name: string; src?: string | null }) {
  const initial = (name.trim()[0] || "?").toUpperCase();
  return (
    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-200 text-neutral-700">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full items-center justify-center text-sm font-semibold">{initial}</span>
      )}
    </div>
  );
}

function slidesFor(look: LookCard): LookSlide[] {
  if (look.slides && look.slides.length > 0) return look.slides;
  if (look.coverUrl) {
    return [{ slot: "look", title: look.title, imageUrl: look.coverUrl }];
  }
  return [];
}

export default function LookPost({
  look,
  onChange,
  onFollowAuthor,
}: {
  look: LookCard;
  onChange: (next: LookCard) => void;
  onFollowAuthor?: (authorId: string, following: boolean) => void;
}) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const name = look.author.displayName || look.author.username;
  const me = getAuthUser();
  const isMine =
    look.isMine ?? Boolean(me?.username && me.username === look.author.username);

  const like = async () => {
    if (!requireShopper(router)) return;
    const prev = look;
    onChange({
      ...look,
      likedByMe: !look.likedByMe,
      likeCount: look.likeCount + (look.likedByMe ? -1 : 1),
    });
    try {
      const result = await toggleLookLike(look.id);
      onChange({ ...look, likedByMe: result.liked, likeCount: result.likeCount });
    } catch (err) {
      onChange(prev);
      showToast(err instanceof Error ? err.message : "Could not like look", "error");
    }
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!requireShopper(router)) return;
    const body = comment.trim();
    if (!body) return;
    setPosting(true);
    try {
      const created = await postLookComment(look.id, body);
      onChange({
        ...look,
        commentCount: look.commentCount + 1,
        comments: [created, ...(look.comments ?? [])],
      });
      setComment("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not post comment", "error");
    } finally {
      setPosting(false);
    }
  };

  return (
    <article className="ui-card relative z-0">
      <header className="flex items-center gap-3 px-4 py-3">
        <Link href={`/u/${look.author.username}`} className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar name={name} src={look.author.avatarUrl} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">{name}</p>
            <p className="truncate text-xs text-neutral-400">@{look.author.username}</p>
          </div>
        </Link>
        {!isMine && (
          <FollowButton
            targetType="user"
            targetId={look.author.id}
            following={Boolean(look.isFollowingAuthor)}
            compact
            onChange={(following) => {
              onChange({ ...look, isFollowingAuthor: following });
              onFollowAuthor?.(look.author.id, following);
            }}
          />
        )}
      </header>

      <LookCarousel
        slides={slidesFor(look)}
        lookTitle={look.title}
        heartBurst={heartBurst}
        onSingleTap={() => router.push(`/looks/${look.id}`)}
        onDoubleTap={() => {
          if (!look.likedByMe) {
            setHeartBurst(true);
            window.setTimeout(() => setHeartBurst(false), 700);
            void like();
          }
        }}
      />

      <div className="px-4 pb-4 pt-3">
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
            onClick={() => document.getElementById(`comment-${look.id}`)?.focus()}
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
          <Link
            href={`/looks/${look.id}`}
            className="ml-auto text-neutral-900 hover:text-neutral-500"
            aria-label="Shop this look"
          >
            <BagIcon />
          </Link>
        </div>

        <p className="mt-2 text-sm font-semibold text-neutral-900">
          {look.likeCount} {look.likeCount === 1 ? "like" : "likes"}
        </p>
        {look.caption && (
          <p className="mt-1 text-sm text-neutral-800">
            <Link href={`/u/${look.author.username}`} className="font-semibold hover:underline">
              {look.author.username}
            </Link>{" "}
            {look.caption}
          </p>
        )}
        <ul className="mt-2 space-y-1">
          {(look.comments ?? []).slice(0, 3).map((entry: LookComment) => (
            <li key={entry.id} className="text-sm text-neutral-800">
              <Link
                href={`/u/${entry.author.username}`}
                className="font-semibold hover:underline"
              >
                {entry.author.displayName || entry.author.username}
              </Link>{" "}
              {entry.body}
            </li>
          ))}
        </ul>
        {look.commentCount > 3 && (
          <Link
            href={`/looks/${look.id}`}
            className="mt-1 block text-sm text-neutral-400 hover:text-neutral-600"
          >
            View all {look.commentCount} comments
          </Link>
        )}

        <form onSubmit={submitComment} className="mt-3 flex items-center gap-2 border-t border-neutral-100 pt-3">
          <input
            id={`comment-${look.id}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            maxLength={280}
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
      </div>
    </article>
  );
}
