export type ToastKind = "success" | "error" | "info";

export const TOAST_EVENT = "bonique:toast";

export function showToast(message: string, kind: ToastKind = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, { detail: { message, kind } }),
  );
}
