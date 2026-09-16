"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { getLocalizedText, getProductStock } from "@/lib/utils/bilingual";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const hasStock = getProductStock(product) > 0;
  const mainImage = product.images[0] || "/placeholder.jpg";
  const secondImage = product.images[1] || mainImage;

  // Calculate discount percentage
  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Get localized name and description
  const name = getLocalizedText(product.name, locale);
  const description = getLocalizedText(product.description, locale);

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Hover Effect */}
      <Link href={`/products/${product._id}`} className="block relative">
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {/* Main Image */}
          <Image
            src={mainImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-all duration-500 ${isHovered && secondImage !== mainImage ? 'opacity-0' : 'opacity-100'
              }`}
            priority={false}
          />
          {/* Second Image on Hover */}
          {secondImage !== mainImage && (
            <Image
              src={secondImage}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                }`}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {!hasStock && (
              <Badge className="bg-gray-900 text-white">
                {t("outOfStock")}
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white font-bold">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isFeatured && hasStock && (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                ⭐ مميز
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10 ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              } ${isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add to Cart Button */}
          {hasStock && onAddToCart && (
            <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                size="sm"
              >
                <ShoppingBag className="w-4 h-4 ml-2" />
                إضافة للسلة
              </Button>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!hasStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-base line-clamp-2 hover:text-purple-600 transition-colors min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-gray-900">
            {product.price} {tCommon("currency")}
          </p>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <p className="text-sm text-gray-400 line-through">
              {product.compareAtPrice}
            </p>
          )}
        </div>

        {/* Stock Indicator */}
        {hasStock && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>متوفر في المخزون</span>
          </div>
        )}
      </div>
    </div>
  );
}
