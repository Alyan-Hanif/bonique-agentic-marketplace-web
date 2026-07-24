/** Reliable image URLs — picsum seeds give a unique stable image per product */
export function productImageUrl(
  productId: string,
  width = 600,
  height = 800
): string {
  return `https://picsum.photos/seed/bonique-${productId}/${width}/${height}`;
}

export const heroImage = "/images/hero/majic.jpg";

export const editorialImage = "/images/hero/majic.jpg";

/** Mock AI try-on result shown after processing */
export const tryOnMockResult = "/images/hero/majic.jpg";

/** Local fallback when a remote image fails to load */
export const imageFallback = "/images/hero/majic.jpg";
