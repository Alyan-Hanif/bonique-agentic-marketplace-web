"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT, type ToastKind } from "@/lib/toast";

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string; kind?: ToastKind }>)
        .detail;
      const message = detail?.message?.trim();
      if (!message) return;
      const item: ToastItem = {
        id: Date.now() + Math.random(),
        message,
        kind: detail.kind ?? "info",
      };
      setToasts((prev) => [...prev.slice(-3), item]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id));
      }, 3200);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex w-[min(92vw,24rem)] -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto rounded-full px-5 py-3 text-center text-sm shadow-lg ${
            toast.kind === "error"
              ? "bg-red-700 text-white"
              : toast.kind === "success"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-800 text-white"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
