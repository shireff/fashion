"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { getLocalizedText, getProductStock } from "@/lib/utils/bilingual";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("product");
  const tCommon = useTranslations("common");

  const hasStock = getProductStock(product) > 0;
  const mainImage = product.images[0] || "/placeholder.jpg";

  // Get localized name and description
  const name = getLocalizedText(product.name, locale);
  const description = getLocalizedText(product.description, locale);

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!hasStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">{t("outOfStock")}</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <p className="text-sm text-gray-400 line-through">
                {product.compareAtPrice} {tCommon("currency")}
              </p>
            )}
            <p className="text-xl font-bold">
              {product.price} {tCommon("currency")}
            </p>
          </div>

          {hasStock && onAddToCart && (
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              className="shrink-0"
            >
              {t("addToCart")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
