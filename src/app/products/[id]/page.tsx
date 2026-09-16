"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetProductByIdQuery } from "@/store/api/productsApi";
import { useAppDispatch } from "@/store";
import { addItem } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductDetailSkeleton } from "@/components/skeletons";
import { getLocalizedText, getProductStock } from "@/lib/utils/bilingual";
import { Heart, ShoppingBag, Share2, Truck, ShieldCheck, RefreshCw, Check } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductByIdResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

export default function ProductDetailPage() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const params = useParams();
  const dispatch = useAppDispatch();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const { data, isLoading, error } = useGetProductByIdQuery(params.id as string);
  const product = (data as ProductByIdResponse | undefined)?.data?.product;

  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0].sku);
    }
  }, [product, selectedVariant]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">لم يتم العثور على المنتج</h2>
          <p className="text-gray-600 mb-6">عذراً، المنتج الذي تبحث عنه غير موجود أو تم حذفه</p>
          <Button asChild>
            <a href="/products">العودة للمنتجات</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addItem({
        product,
        quantity,
        variantId: selectedVariant || undefined,
      })
    );
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  // Get localized name and description
  const name = getLocalizedText(product?.name, locale);
  const description = getLocalizedText(product?.description, locale);

  const hasStock = getProductStock(product || {}) > 0;
  const selectedVariantData = product?.variants?.find((v) => v.sku === selectedVariant);
  const images = product?.images || [];

  // Calculate discount percentage
  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
              <Image
                src={images[selectedImage] || "/placeholder.jpg"}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {!hasStock && (
                  <Badge className="bg-gray-900 text-white px-3 py-1.5 text-sm">
                    نفذ من المخزون
                  </Badge>
                )}
                {discountPercentage > 0 && hasStock && (
                  <Badge className="bg-red-500 text-white font-bold px-3 py-1.5 text-sm">
                    خصم {discountPercentage}%
                  </Badge>
                )}
                {product.isFeatured && hasStock && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 text-sm">
                    ⭐ مميز
                  </Badge>
                )}
              </div>

              {/* Favorite & Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${isFavorite ? 'text-red-500' : 'text-gray-600'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => navigator.share?.({ title: name, url: window.location.href })}
                  className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-gray-600"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                        ? 'border-purple-600 ring-2 ring-purple-200 shadow-md'
                        : 'border-transparent hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${name} ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Title & Price */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                {name}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {product.price} {tCommon("currency")}
                </p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-xl text-gray-400 line-through">
                    {product.compareAtPrice} {tCommon("currency")}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              {hasStock && selectedVariantData && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-green-700 font-medium">
                    متوفر ({selectedVariantData.quantity} قطعة)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                {description}
              </p>
            </div>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-lg font-semibold text-gray-900">
                    {t("selectSize")}
                  </label>
                  {selectedVariantData && (
                    <span className="text-sm text-gray-500">
                      المقاس: {selectedVariantData.size}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.sku}
                      onClick={() => setSelectedVariant(variant.sku)}
                      disabled={variant.quantity === 0}
                      className={`relative min-w-[60px] px-5 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${selectedVariant === variant.sku
                          ? 'border-purple-600 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                        } ${variant.quantity === 0
                          ? 'opacity-40 cursor-not-allowed line-through'
                          : ''
                        }`}
                    >
                      {variant.size}
                      {selectedVariant === variant.sku && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900">
                {t("quantity")}
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center font-bold text-lg"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-16 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 flex items-center justify-center font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!hasStock}
              size="lg"
              className={`w-full text-lg py-7 rounded-xl font-bold shadow-lg transition-all duration-300 ${isAddedToCart
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-5 h-5 ml-2" />
                  تمت الإضافة!
                </>
              ) : hasStock ? (
                <>
                  <ShoppingBag className="w-5 h-5 ml-2" />
                  {t("addToCart")}
                </>
              ) : (
                t("outOfStock")
              )}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">شحن سريع</h4>
                  <p className="text-xs text-gray-600">توصيل 2-5 أيام</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">دفع آمن</h4>
                  <p className="text-xs text-gray-600">معاملات محمية</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">إرجاع سهل</h4>
                  <p className="text-xs text-gray-600">خلال 14 يوم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
