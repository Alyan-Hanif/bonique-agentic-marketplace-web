import type { Product } from "./types";

/**
 * Placeholder keyword-matching logic for style recommendations.
 * The AI developer will replace this with a real embedding/vector search call,
 * keeping the same function signature as a drop-in replacement.
 */
const KEYWORD_MAP: Record<string, string[]> = {
  winter: ["winter", "outerwear", "coat", "puffer", "fleece", "knitwear", "cozy"],
  cozy: ["cozy", "winter", "knitwear", "fleece", "hoodie", "sweater"],
  cold: ["winter", "outerwear", "coat", "puffer"],
  grunge: ["grunge", "vintage", "denim", "graphic", "streetwear"],
  "90s": ["grunge", "vintage", "streetwear", "graphic"],
  vintage: ["vintage", "grunge", "denim"],
  casual: ["casual", "hoodie", "tee", "jeans", "sneakers"],
  weekend: ["casual", "hoodie", "tee", "sneakers"],
  formal: ["workwear", "blazer", "trousers", "dress"],
  work: ["workwear", "blazer", "office"],
  office: ["workwear", "blazer"],
  dress: ["dresses", "dress", "evening"],
  evening: ["evening", "dresses", "dress"],
  party: ["evening", "dresses", "party"],
  shoes: ["footwear", "sneakers", "boots"],
  sneakers: ["footwear", "sneakers"],
  boots: ["footwear", "boots"],
  affordable: ["sale", "casual", "tee"],
  cheap: ["sale", "casual"],
  budget: ["sale", "affordable"],
  men: ["men"],
  women: ["women"],
  kids: ["kids"],
  jacket: ["outerwear", "jacket", "denim", "bomber"],
  hoodie: ["hoodie", "streetwear", "casual"],
  jeans: ["denim", "jeans", "bottoms"],
  summer: ["linen", "dress", "sandals", "casual"],
  streetwear: ["streetwear", "hoodie", "sneakers", "graphic"],
  sporty: ["sneakers", "running", "athletic"],
  accessory: ["accessories"],
  bag: ["accessories", "bag"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreProduct(product: Product, tokens: string[]): number {
  const searchable = [
    product.title,
    product.description,
    product.brand,
    product.department,
    ...product.styleCategories,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  for (const token of tokens) {
    if (searchable.includes(token)) {
      score += 3;
    }

    const mappedTags = KEYWORD_MAP[token];
    if (mappedTags) {
      for (const tag of mappedTags) {
        if (searchable.includes(tag)) {
          score += 2;
        }
        if (product.styleCategories.some((c) => c.includes(tag))) {
          score += 2;
        }
      }
    }
  }

  if (tokens.some((t) => ["affordable", "cheap", "budget"].includes(t)) && product.price < 80) {
    score += 2;
  }

  return score;
}

export function matchProductsByPrompt(
  prompt: string,
  products: Product[]
): Product[] {
  const tokens = tokenize(prompt);
  if (tokens.length === 0) return products.slice(0, 6);

  const scored = products
    .map((product) => ({ product, score: scoreProduct(product, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return products.slice(0, 6);
  }

  return scored.slice(0, 6).map((item) => item.product);
}
