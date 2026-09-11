export const CART_UPDATED_EVENT = "bonique:cart-updated";
export const REVEAL_HEADER_EVENT = "bonique:reveal-header";

export function revealHeader() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REVEAL_HEADER_EVENT));
}

export function notifyCartUpdated(itemCount: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, { detail: { itemCount } }),
  );
  revealHeader();
}

function cartIconRect() {
  const cart = document.getElementById("header-cart-icon");
  if (!cart) return null;
  const rect = cart.getBoundingClientRect();
  if (rect.width === 0 || rect.bottom < 8) return null;
  return { el: cart, rect };
}

export function flyImageToCart(fromEl: HTMLElement | null, imageSrc?: string) {
  if (typeof window === "undefined" || !fromEl) {
    return Promise.resolve();
  }

  revealHeader();

  return new Promise<void>((resolve) => {
    const run = () => {
      const target = cartIconRect();
      const img = fromEl.querySelector("img");
      const src = img?.currentSrc || img?.src || imageSrc;
      if (!target || !src) {
        resolve();
        return;
      }

      const from = fromEl.getBoundingClientRect();
      const ghost = document.createElement("img");
      ghost.src = src;
      ghost.alt = "";
      ghost.className = "cart-fly-ghost";
      ghost.style.left = `${from.left}px`;
      ghost.style.top = `${from.top}px`;
      ghost.style.width = `${from.width}px`;
      ghost.style.height = `${from.height}px`;
      document.body.appendChild(ghost);
      ghost.getBoundingClientRect();

      const dx =
        target.rect.left +
        target.rect.width / 2 -
        (from.left + from.width / 2);
      const dy =
        target.rect.top +
        target.rect.height / 2 -
        (from.top + from.height / 2);
      ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.08)`;
      ghost.style.opacity = "0.15";

      window.setTimeout(() => {
        ghost.remove();
        resolve();
      }, 720);
    };

    window.setTimeout(run, cartIconRect() ? 40 : 280);
  });
}
