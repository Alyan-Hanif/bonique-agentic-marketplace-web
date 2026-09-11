"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";

const HOLD_MS = 900;
const FADE_MS = 500;
const SEEN_KEY = "bonique-intro-played";

export default function IntroSplash() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useLayoutEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setPhase("gone");
      return;
    }

    sessionStorage.setItem(SEEN_KEY, "1");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = prefersReduced ? 120 : HOLD_MS;
    const fade = prefersReduced ? 120 : FADE_MS;

    const outTimer = window.setTimeout(() => setPhase("out"), hold);
    const goneTimer = window.setTimeout(() => setPhase("gone"), hold + fade);

    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(goneTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[400] flex items-center justify-center bg-black transition-opacity ease-out ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      aria-hidden
    >
      <div className="animate-intro-logo flex flex-col items-center">
        <Image
          src="/images/hero/logo-1.png"
          alt="Bonique"
          width={200}
          height={180}
          className="h-28 w-auto object-contain sm:h-36"
          priority
        />
        <p className="mt-5 font-serif text-sm uppercase tracking-[0.45em] text-white/80">
          Bonique
        </p>
      </div>
    </div>
  );
}
