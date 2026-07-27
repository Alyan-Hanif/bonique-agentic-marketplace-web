/**
 * Curated Unsplash photo IDs — verified fashion/clothing imagery per product.
 * Format: https://images.unsplash.com/{id}?w=600&h=800&fit=crop&auto=format&q=80
 */
const PRODUCT_PHOTO_IDS: Record<string, string> = {
  p1: "photo-1556821840-3a63f95609a7",   // hoodie / sweatshirt
  p2: "photo-1541099649105-f69ad21f3246", // denim jacket
  p3: "photo-1594938298603-c8148c4dae35", // wool overcoat
  p4: "photo-1542291026-7eec264c27ff",   // sneakers
  p5: "photo-1515886657613-9f3515b0c78f", // dress / women's fashion
  p6: "photo-1521572163474-6864f9cf17ab", // t-shirt
  p7: "photo-1558769132-cb1aea458c5e",   // chinos / trousers
  p8: "photo-1548036328-c9fa89d128fa",   // puffer / winter jacket
  p9: "photo-1542272604-787c3835535d",   // jeans
  p10: "photo-1594633312681-425c7b97ccd1", // boots
  p11: "photo-1509631179647-0177331693ae", // blazer / suit
  p12: "photo-1487222477894-8943e31ef7b2", // handbag
  p13: "photo-1551028719-00167b16eac5",  // bomber jacket
  p14: "photo-1576566588028-4147f3842f27", // knit sweater
  p15: "photo-1620799140408-edc6dcb6d633", // cargo pants / streetwear
  p16: "photo-1566174053879-31528523f8ae", // slip dress
  p17: "photo-1606107557195-0e29a4b5b4aa", // running sneakers
  p18: "photo-1503341504253-dff4815485f1", // kids jacket
  p19: "photo-1556905055-8f358a7a47b2",  // kids hoodie
  p20: "photo-1622445275463-afa2ab738c34", // fleece pullover
  p21: "photo-1583743814966-8936f5b7be1a", // leather belt / accessories
  p22: "photo-1572635196237-14b3f281503f", // sunglasses
  p23: "photo-1552374196-c4e7ffc6e126",  // ankle boots / footwear
  p24: "photo-1434389677669-e08b4cac3105", // linen shirt
};

const DEFAULT_PHOTO_ID = "photo-1489987707025-afc232f7ea0f";

export function productImageUrl(
  productId: string,
  width = 600,
  height = 800
): string {
  const photoId = PRODUCT_PHOTO_IDS[productId] ?? DEFAULT_PHOTO_ID;
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

export const heroImage = "/images/hero/hero.jpeg";

export const editorialImage =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=500&fit=crop&auto=format&q=80";

/** Mock AI try-on result shown after processing */
export const tryOnMockResult = "/images/hero/hoodie.jpeg";

/** Local fallback when a remote image fails to load */
export const imageFallback = "/images/hero/grey.jpg";
