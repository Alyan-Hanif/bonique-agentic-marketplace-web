"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  extraLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onExtra?: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  extraLabel,
  onConfirm,
  onCancel,
  onExtra,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  if (!mounted) return null;

  return createPortal(
    <div
        className="fixed inset-0 z-[200] flex animate-fade-in items-center justify-center bg-black/50 px-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-lg font-semibold text-stone-900">
          {title}
        </h2>
        <p id="confirm-modal-desc" className="mt-2 text-sm text-stone-500">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-400"
          >
            {cancelLabel}
          </button>
          {extraLabel && onExtra && (
            <button
              type="button"
              onClick={onExtra}
              className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-400"
            >
              {extraLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
