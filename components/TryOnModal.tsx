"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { tryOnMockResult } from "@/lib/product-images";

interface TryOnModalProps {
  open: boolean;
  onClose: () => void;
  productTitle: string;
}

type TryOnState = "idle" | "loading" | "done";

export default function TryOnModal({
  open,
  onClose,
  productTitle,
}: TryOnModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<TryOnState>("idle");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetState = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setState("idle");
    setUploadPreview(null);
    setProgress(0);
  };

  useEffect(() => {
    if (!open) resetState();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadPreview) URL.revokeObjectURL(uploadPreview);

    const previewUrl = URL.createObjectURL(file);
    setUploadPreview(previewUrl);
    setState("loading");
    setProgress(0);

    const startTime = Date.now();
    const duration = 10000;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(100, Math.round((elapsed / duration) * 100)));
    }, 100);

    timerRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setState("done");
    }, duration);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-neutral-900">Try It On</h2>
            <p className="text-xs text-neutral-500 line-clamp-1">{productTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/*
            Placeholder UI only — actual virtual try-on image generation/processing
            will be implemented by the AI developer using a vision model.
          */}
          {state === "idle" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 transition-colors hover:border-accent hover:bg-accent/5"
            >
              <svg className="mb-3 h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <p className="text-sm font-medium text-neutral-700">
                Upload a photo to see how this looks on you
              </p>
              <p className="mt-1 text-xs text-neutral-400">JPG or PNG, up to 10MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadPreview && state !== "idle" && (
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100">
              <Image
                src={state === "done" ? tryOnMockResult : uploadPreview}
                alt="Try-on preview"
                fill
                className={`object-cover transition-opacity duration-500 ${state === "loading" ? "opacity-40 blur-sm" : "opacity-100"}`}
                unoptimized={state !== "done"}
              />

              {state === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 px-6">
                  <svg className="mb-4 h-10 w-10 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm font-semibold text-white">Generating your try-on...</p>
                  <p className="mt-1 text-xs text-white/70">This may take a few seconds</p>
                  <div className="mt-4 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full bg-accent transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/60">{progress}%</p>
                </div>
              )}

              {state === "done" && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    AI Try-On Preview
                  </p>
                  <p className="text-sm text-white">Here&apos;s how {productTitle} could look on you</p>
                </div>
              )}
            </div>
          )}

          {state === "done" && (
            <button
              onClick={() => {
                resetState();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="w-full border border-neutral-900 py-3 text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              Try Another Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
