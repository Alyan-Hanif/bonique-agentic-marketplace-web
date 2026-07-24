"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const DRAG_THRESHOLD = 8;
const STORAGE_KEY = "bonique-style-fab-position";

interface Position {
  x: number;
  y: number;
}

function getDefaultPosition(): Position {
  if (typeof window === "undefined") return { x: 24, y: 24 };
  return {
    x: Math.max(16, window.innerWidth - 260),
    y: Math.max(16, window.innerHeight - 88),
  };
}

function clampPosition(x: number, y: number, width: number, height: number): Position {
  const maxX = Math.max(16, window.innerWidth - width - 16);
  const maxY = Math.max(16, window.innerHeight - height - 16);
  return {
    x: Math.min(Math.max(16, x), maxX),
    y: Math.min(Math.max(16, y), maxY),
  };
}

export default function StyleRecommender() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [position, setPosition] = useState<Position | null>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    pointerId: -1,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Position;
        setPosition(parsed);
        return;
      } catch {
        // fall through to default
      }
    }
    setPosition(getDefaultPosition());
  }, []);

  const savePosition = useCallback((pos: Position) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fabRef.current || !position) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
      pointerId: e.pointerId,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !fabRef.current) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragState.current.moved = true;
    }

    if (!dragState.current.moved) return;

    const rect = fabRef.current.getBoundingClientRect();
    const next = clampPosition(
      dragState.current.originX + dx,
      dragState.current.originY + dy,
      rect.width,
      rect.height
    );
    setPosition(next);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    if (dragState.current.moved && position) {
      savePosition(position);
    } else if (!dragState.current.moved) {
      setOpen(true);
    }

    dragState.current.active = false;
    dragState.current.moved = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setOpen(false);
    router.push(`/style?q=${encodeURIComponent(prompt.trim())}`);
  };

  const handleClose = () => {
    setOpen(false);
    setPrompt("");
  };

  if (pathname === "/style" || !position) return null;

  return (
    <>
      <div
        ref={fabRef}
        role="button"
        tabIndex={0}
        aria-label="Find your style — AI outfit recommendations. Drag to move."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        style={{ left: position.x, top: position.y }}
        className="fixed z-50 flex max-w-[240px] cursor-grab items-center gap-3 rounded-2xl border border-accent/40 bg-black px-3 py-2.5 shadow-2xl transition-shadow active:cursor-grabbing active:shadow-accent/20 sm:max-w-[260px] sm:px-4 sm:py-3 touch-none select-none animate-pulse-glow"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-black">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight text-white">Find Your Style</p>
          <p className="text-[11px] leading-tight text-accent sm:text-xs">
            AI outfit picks — tap to start
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-0.5 text-neutral-500" aria-hidden="true">
          <span className="h-0.5 w-1 rounded-full bg-current" />
          <span className="h-0.5 w-1 rounded-full bg-current" />
          <span className="h-0.5 w-1 rounded-full bg-current" />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative w-full max-w-lg rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-neutral-900">
                  Find Your Style
                </h2>
                <p className="text-xs text-neutral-500">Describe what you&apos;re looking for</p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 px-5 py-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "cozy winter outfit for a casual weekend" or "90s grunge but affordable"'
                rows={3}
                autoFocus
                className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="w-full rounded-full bg-accent py-3 text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Find Styles
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
