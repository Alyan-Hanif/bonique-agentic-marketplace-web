"use client";

import { useEffect, useRef, useState } from "react";
import ProductImage from "@/components/ProductImage";
import { HeartIcon } from "@/components/LookIcons";
import type { LookSlide } from "@/lib/social";

const AUTO_MS = 3500;

export default function LookCarousel({
  slides,
  lookTitle,
  onSingleTap,
  onDoubleTap,
  heartBurst,
}: {
  slides: LookSlide[];
  lookTitle: string;
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
  heartBurst?: boolean;
}) {
  const usable = slides.filter((slide) => slide.imageUrl);
  const list = usable.length > 0 ? usable : slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safeIndex = list.length === 0 ? 0 : index % list.length;
  const current = list[safeIndex];

  useEffect(() => {
    if (paused || list.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused, list.length]);

  const goTo = (next: number) => {
    setIndex(next);
    setPaused(true);
    window.setTimeout(() => setPaused(false), AUTO_MS * 2);
  };

  const onImageClick = () => {
    if (tapTimer.current) {
      window.clearTimeout(tapTimer.current);
      tapTimer.current = null;
      onDoubleTap?.();
      return;
    }
    tapTimer.current = window.setTimeout(() => {
      tapTimer.current = null;
      onSingleTap?.();
    }, 280);
  };

  return (
    <div>
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {list.map((slide, i) =>
          slide.imageUrl ? (
            <div
              key={`${slide.slot}-${slide.title}-${i}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                i === safeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <ProductImage
                src={slide.imageUrl}
                alt={slide.title || lookTitle}
                fill
                className="object-cover"
              />
            </div>
          ) : null,
        )}
        <button
          type="button"
          onClick={onImageClick}
          className="absolute inset-0 z-10"
          aria-label={lookTitle}
        />
        {!current?.imageUrl && (
          <span className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
            Look
          </span>
        )}

        {heartBurst && (
          <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-white drop-shadow-lg">
            <HeartIcon filled className="h-20 w-20 animate-pulse" />
          </span>
        )}

        {list.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
            {list.map((slide, i) => (
              <button
                key={`${slide.slot}-${slide.title}-${i}`}
                type="button"
                aria-label={`Show ${slide.title}`}
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(i);
                }}
                className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                  i === safeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-3">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{lookTitle}</h2>
        {current && (
          <p className="mt-0.5 text-xs uppercase tracking-widest text-neutral-400 transition-opacity duration-500">
            {current.slot}
            {current.title ? ` · ${current.title}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
