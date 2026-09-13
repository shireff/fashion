"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetProductByIdQuery } from "@/store/api/productsApi";
import { useAppDispatch } from "@/store";
import { addItem } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { ProductDetailSkeleton } from "@/components/skeletons";
import { getLocalizedText, getProductStock } from "@/lib/utils/bilingual";
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
        <div className="text-center text-red-600">{tCommon("error")}</div>
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
  };

  // Get localized name and description
  const name = getLocalizedText(product?.name, locale);
  const description = getLocalizedText(product?.description, locale);

  const hasStock = getProductStock(product || {}) > 0;
  const selectedVariantData = product?.variants?.find((v) => v.sku === selectedVariant);
  const images = product?.images || [];

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
            <Image
              src={images[selectedImage] || "/placeholder.jpg"}
              alt={name}
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 overflow-hidden border-2 ${selectedImage === index ? "border-black" : "border-transparent"
                    }`}
                >
                  <Image
                    src={image}
                    alt={`${name} ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{name}</h1>
            <p className="text-3xl font-bold">
              {product.price} {tCommon("currency")}
            </p>
          </div>

          <p className="text-lg leading-relaxed text-gray-600">{description}</p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block font-medium">{t("selectSize")}</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.sku}
                    onClick={() => setSelectedVariant(variant.sku)}
                    disabled={variant.quantity === 0}
                    className={`px-6 py-3 border-2 font-medium transition-colors ${selectedVariant === variant.sku
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                      } ${variant.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <label className="block font-medium">{t("quantity")}</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={!hasStock}
            size="lg"
            className="w-full text-lg py-6"
          >
            {hasStock ? t("addToCart") : t("outOfStock")}
          </Button>
        </div>
      </div>
    </div>
  );
}
