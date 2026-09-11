"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import type { LookCard } from "@/lib/social";

export default function LookCardView({ look }: { look: LookCard }) {
  const name = look.author.displayName || look.author.username;
  return (
    <article className="ui-card">
      <Link href={`/looks/${look.id}`} className="block">
        <div className="relative aspect-[4/5] bg-neutral-100">
          {look.coverUrl ? (
            <ProductImage
              src={look.coverUrl}
              alt={look.title}
              productId={look.id}
              fill
              className="object-cover transition duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
              Look
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link
          href={`/u/${look.author.username}`}
          className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 hover:text-neutral-900"
        >
          {name}
        </Link>
        <Link href={`/looks/${look.id}`}>
          <h2 className="mt-1 font-serif text-lg font-semibold text-neutral-900">{look.title}</h2>
        </Link>
        {look.caption && (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{look.caption}</p>
        )}
        <p className="mt-2 text-xs text-neutral-400">
          {look.likeCount} likes · {look.commentCount} comments
        </p>
      </div>
    </article>
  );
}
