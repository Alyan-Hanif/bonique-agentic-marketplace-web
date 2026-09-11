"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { CommentIcon, HeartIcon } from "@/components/LookIcons";
import type { LookCard } from "@/lib/social";

export default function LookGrid({ looks }: { looks: LookCard[] }) {
  return (
    <div className="stagger-in grid grid-cols-2 gap-4 sm:grid-cols-3">
      {looks.map((look) => (
        <Link key={look.id} href={`/looks/${look.id}`} className="group">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            {look.coverUrl ? (
              <ProductImage
                src={look.coverUrl}
                alt={look.title}
                productId={look.id}
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-neutral-400">
                Look
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center gap-4 bg-black/0 text-sm font-semibold text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              <span className="flex items-center gap-1">
                <HeartIcon filled className="h-4 w-4" />
                {look.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <CommentIcon className="h-4 w-4" />
                {look.commentCount}
              </span>
            </span>
          </div>
          <p className="mt-2 truncate font-serif text-sm font-semibold text-neutral-900">{look.title}</p>
          <p className="text-xs text-neutral-400">
            {look.likeCount} likes · {look.commentCount} comments
          </p>
        </Link>
      ))}
    </div>
  );
}
