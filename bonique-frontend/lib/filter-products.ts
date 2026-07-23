import type { Product, ProductFilters } from "./types";

export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  return products.filter((product) => {
    const searchLower = filters.search.toLowerCase().trim();
    if (
      searchLower &&
      !product.title.toLowerCase().includes(searchLower) &&
      !product.brand.toLowerCase().includes(searchLower)
    ) {
      return false;
    }

    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    if (filters.sizes.length > 0) {
      const productSizes = product.variants.map((v) => v.sizeLabel);
      if (!filters.sizes.some((size) => productSizes.includes(size))) {
        return false;
      }
    }

    if (filters.colors.length > 0) {
      const productColors = product.variants.map((v) => v.color);
      if (!filters.colors.some((color) => productColors.includes(color))) {
        return false;
      }
    }

    return true;
  });
}
