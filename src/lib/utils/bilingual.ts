import type { BilingualText } from "@/types";

/**
 * Get localized text from bilingual object or string
 */
export function getLocalizedText(
  text: BilingualText | string | undefined | null,
  locale: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] || text.ar || text.en || "";
}

/**
 * Get product name based on locale
 */
export function getProductName(
  product: { name: BilingualText | string } | undefined,
  locale: "ar" | "en"
): string {
  if (!product) return "";
  return getLocalizedText(product.name, locale);
}

/**
 * Get category name based on locale
 */
export function getCategoryName(
  category: { name: BilingualText | string } | undefined,
  locale: "ar" | "en"
): string {
  if (!category) return "";
  return getLocalizedText(category.name, locale);
}

/**
 * Calculate total stock from variants
 */
export function getProductStock(product: {
  variants?: Array<{ quantity: number }>;
  stock?: number;
}): number {
  if (product.stock !== undefined) return product.stock;
  if (!product.variants || product.variants.length === 0) return 0;
  return product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
}

/**
 * Get primary SKU from product
 */
export function getProductSKU(product: {
  sku?: string;
  variants?: Array<{ sku: string }>;
}): string {
  if (product.sku) return product.sku;
  if (product.variants && product.variants.length > 0) {
    return product.variants[0]?.sku || "";
  }
  return "";
}
