"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/store";
import { useGetOrderByIdQuery, useCancelOrderMutation } from "@/store/api/ordersApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderCardSkeleton } from "@/components/skeletons";
import { getLocalizedText } from "@/lib/utils/bilingual";
import type { OrderItem } from "@/types/order";
import type { Product } from "@/types/product";

export default function OrderDetailPage() {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  const params = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading, error } = useGetOrderByIdQuery(params.id as string, {
    skip: !user,
  });
  const [cancelOrder] = useCancelOrderMutation();

  const order = data?.data?.order;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <OrderCardSkeleton />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="text-center text-red-600">{tCommon("error")}</div>
      </div>
    );
  }

  const handleCancelOrder = async () => {
    if (!confirm(t("confirmCancel"))) return;
    try {
      await cancelOrder(order._id).unwrap();
      router.push("/orders");
    } catch (err) {
      alert(tCommon("error"));
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const shippingAddress = typeof order.shippingAddress === "object"
    ? order.shippingAddress
    : null;

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-5xl font-bold">{t("orderDetails")}</h1>
          <Badge variant={getStatusVariant(order.status)}>
            {t(`statuses.${order.status}`)}
          </Badge>
        </div>
        <p className="text-lg text-gray-600">
          {t("orderNumber")}: <span className="font-mono font-bold">{order.orderNumber}</span>
        </p>
        <p className="text-gray-600">
          {t("orderDate")}: {new Date(order.createdAt).toLocaleDateString("ar-EG")}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">{t("items")}</h2>
          {order.items.map((item: OrderItem, index: number) => {
            const product = typeof item.product === "object" ? item.product as Product : null;
            if (!product) return null;

            return (
              <div key={index} className="flex gap-6 pb-6 border-b">
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                  <Image
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={getLocalizedText(product.name, locale)}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold">{getLocalizedText(product.name, locale)}</h3>
                  <p className="text-sm text-gray-600">
                    {t("quantity")}: {item.quantity}
                  </p>
                  <p className="font-bold mt-2">
                    {item.price * item.quantity} {tCommon("currency")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-8">
          {/* Shipping Address */}
          {shippingAddress && (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t("shippingAddress")}</h2>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium">{shippingAddress.recipientName}</p>
                <p>{shippingAddress.streetAddress}</p>
                <p>
                  {shippingAddress.area}, {shippingAddress.city}
                </p>
                <p>{shippingAddress.governorate}</p>
                <p>{shippingAddress.recipientPhone}</p>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{t("summary")}</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>{t("subtotal")}</span>
                <span className="font-bold">
                  {order.totalAmount - (order.shippingCost || 0)} {tCommon("currency")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("shipping")}</span>
                <span className="font-bold">
                  {order.shippingCost || 0} {tCommon("currency")}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>{tCommon("total")}</span>
                <span>
                  {order.totalAmount} {tCommon("currency")}
                </span>
              </div>
            </div>
          </div>

          {order.status === "pending" && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancelOrder}
            >
              {t("cancelOrder")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
