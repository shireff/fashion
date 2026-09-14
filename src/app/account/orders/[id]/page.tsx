/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useGetOrderByIdQuery } from "@/store/api/ordersApi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Phone,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const { data, isLoading, error } = useGetOrderByIdQuery(id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = data?.data?.order as any; // Type assertion for backend compatibility

  // Order status colors and icons
  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        label: t("orders.status.pending"),
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: CheckCircle,
        label: t("orders.status.confirmed"),
      },
      processing: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Package,
        label: t("orders.status.processing"),
      },
      shipped: {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: Truck,
        label: t("orders.status.shipped"),
      },
      delivered: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: t("orders.status.delivered"),
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: t("orders.status.cancelled"),
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-5xl mx-auto px-4">
          <Card className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("orders.orderNotFound")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("orders.orderNotFoundDescription")}
            </p>
            <Button onClick={() => router.push("/account/orders")}>
              {t("orders.backToOrders")}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-5xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/account/orders")}
            className="gap-2"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            {t("orders.backToOrders")}
          </Button>
        </div>

        {/* Order Header */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t("orders.orderNumber")}: {order.orderNumber}
              </h1>
              <p className="text-sm text-gray-600">
                {t("orders.orderDate")}:{" "}
                {format(new Date(order.createdAt), "PPP", {
                  locale: isRTL ? ar : undefined,
                })}
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color} font-medium`}
            >
              <StatusIcon className="w-5 h-5" />
              {statusConfig.label}
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-600" />
            {t("orders.orderItems")}
          </h2>

          <div className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {isRTL ? item.productNameAr : item.productNameEn}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      {t("products.color")}:{" "}
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300 align-middle"
                        style={{ backgroundColor: item.color }}
                      />{" "}
                      {isRTL ? item.colorNameAr : item.colorNameEn}
                    </p>
                    <p>
                      {t("products.size")}: <span className="font-medium">{item.size}</span>
                    </p>
                    <p>
                      {t("orders.quantity")}: <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p>
                      {t("orders.unitPrice")}: <span className="font-medium">{item.unitPrice} {t("common.currency")}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {item.subtotal} {t("common.currency")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>{t("orders.subtotal")}</span>
              <span className="font-medium">
                {order.subtotal} {t("common.currency")}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t("orders.shippingCost")}</span>
              <span className="font-medium">
                {order.shippingCost} {t("common.currency")}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>{t("orders.total")}</span>
              <span>{order.totalAmount} {t("common.currency")}</span>
            </div>
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-600" />
            {t("orders.shippingAddress")}
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">{order.shippingAddress.recipientName}</p>
                <p className="text-sm text-gray-600">{t("orders.recipient")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium" dir="ltr">
                  {order.shippingAddress.recipientPhone}
                </p>
                <p className="text-sm text-gray-600">{t("orders.phone")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">
                  {order.shippingAddress.streetAddress}
                  {order.shippingAddress.buildingNumber &&
                    `, ${t("address.building")} ${order.shippingAddress.buildingNumber}`}
                  {order.shippingAddress.floorNumber &&
                    `, ${t("address.floor")} ${order.shippingAddress.floorNumber}`}
                  {order.shippingAddress.apartmentNumber &&
                    `, ${t("address.apartment")} ${order.shippingAddress.apartmentNumber}`}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.area && `${order.shippingAddress.area}, `}
                  {order.shippingAddress.city}, {order.shippingAddress.governorate}
                </p>
                {order.shippingAddress.landmark && (
                  <p className="text-sm text-gray-600">
                    {t("address.landmark")}: {order.shippingAddress.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Payment & Notes */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-purple-600" />
              {t("orders.paymentMethod")}
            </h2>
            <p className="text-gray-700">{t("orders.cashOnDelivery")}</p>
          </Card>

          {order.notes && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t("orders.notes")}
              </h2>
              <p className="text-gray-700">{order.notes}</p>
            </Card>
          )}
        </div>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-600" />
              {t("orders.statusHistory")}
            </h2>

            <div className="space-y-4">
              {order.statusHistory.map((history: any, index: number) => {
                const config = getStatusConfig(history.status);
                const Icon = config.icon;

                return (
                  <div key={index} className="flex gap-4">
                    <div className={`p-2 rounded-full ${config.color} h-fit`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{config.label}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(history.timestamp), "PPpp", {
                          locale: isRTL ? ar : undefined,
                        })}
                      </p>
                      {history.note && (
                        <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Cancellation Info */}
        {order.status === "cancelled" && order.cancellationReason && (
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              {t("orders.cancellationReason")}
            </h2>
            <p className="text-red-800">{order.cancellationReason}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
