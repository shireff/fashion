"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store";
import { removeItem, updateQuantity } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
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
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <p className="text-xl text-gray-600">{t("empty")}</p>
          <Button asChild>
            <Link href="/products">{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">{t("title")}</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={`${item.product._id}-${item.variantId || "default"}`} className="flex gap-6 pb-6 border-b">
              <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                <Image
                  src={item.product.images[0] || "/placeholder.jpg"}
                  alt={item.product.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <Link href={`/products/${item.product._id}`}>
                    <h3 className="text-lg font-bold hover:underline">{item.product.name}</h3>
                  </Link>
                  {item.variant && (
                    <p className="text-gray-600">
                      {item.variant.size} {item.variant.color && `/ ${item.variant.color}`}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                      className="w-8 h-8 border border-gray-300 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
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
                      className="w-8 h-8 border border-gray-300 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right space-y-2">
                    <p className="text-lg font-bold">
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
                      className="text-sm text-red-600 hover:underline"
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("orderSummary")}</h2>

            <div className="space-y-4 py-6 border-y">
              <div className="flex justify-between">
                <span>{t("subtotal")}</span>
                <span className="font-bold">
                  {totalAmount} {tCommon("currency")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("shipping")}</span>
                <span className="font-bold">{t("calculated")}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>{t("total")}</span>
              <span>
                {totalAmount} {tCommon("currency")}
              </span>
            </div>

            <Button onClick={handleCheckout} size="lg" className="w-full">
              {t("checkout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
