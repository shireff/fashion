"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store";
import { removeItem, updateQuantity } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { getLocalizedText } from "@/lib/utils/bilingual";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const handleCheckout = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-md mx-auto text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-100 rounded-full blur-3xl opacity-40 animate-pulse" />
              <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-full p-12 inline-block">
                <ShoppingBag className="w-24 h-24 text-purple-600" strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{t("title")}</h1>
              <p className="text-lg text-gray-600">{t("empty")}</p>
            </div>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all">
              <Link href="/products">{t("continueShopping")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600">{items.length} {items.length === 1 ? 'منتج' : 'منتجات'} في السلة</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product._id}-${item.variantId || "default"}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 sm:p-6">
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Image */}
                    <Link href={`/products/${item.product._id}`} className="flex-shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden">
                        <Image
                          src={item.product.images[0] || "/placeholder.jpg"}
                          alt={getLocalizedText(item.product.name, locale)}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="space-y-3">
                        <div>
                          <Link href={`/products/${item.product._id}`}>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2">
                              {getLocalizedText(item.product.name, locale)}
                            </h3>
                          </Link>
                          {item.variant && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.variant.size} {item.variant.color && `• ${item.variant.color}`}
                            </p>
                          )}
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between gap-4">
                          {/* Quantity */}
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                            <button
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: item.product._id,
                                    variantId: item.variantId,
                                    quantity: Math.max(1, item.quantity - 1),
                                  })
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: item.product._id,
                                    variantId: item.variantId,
                                    quantity: item.quantity + 1,
                                  })
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="text-left">
                            <p className="text-lg sm:text-xl font-bold text-gray-900">
                              {item.product.price * item.quantity} {tCommon("currency")}
                            </p>
                            <button
                              onClick={() =>
                                dispatch(
                                  removeItem({
                                    productId: item.product._id,
                                    variantId: item.variantId,
                                  })
                                )
                              }
                              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mt-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {t("remove")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sticky Card */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{t("orderSummary")}</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>{t("subtotal")}</span>
                    <span className="font-semibold">{totalAmount} {tCommon("currency")}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{t("shipping")}</span>
                    <span className="font-semibold text-purple-600">{t("calculated")}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Grand Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">{t("total")}</span>
                  <span className="text-2xl font-bold text-purple-600">{totalAmount} {tCommon("currency")}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-bold py-6"
                >
                  {t("checkout")}
                </Button>

                {/* Continue Shopping Link */}
                <Link
                  href="/products"
                  className="block text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← {t("continueShopping")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
