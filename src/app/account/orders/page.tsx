"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingBag, Package, Calendar, CreditCard, Eye, X } from "lucide-react";
import { useAppSelector } from "@/store";
import { useGetOrdersQuery, useCancelOrderMutation } from "@/store/api/ordersApi";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { OrderCardSkeleton } from "@/components/skeletons";

export default function AccountOrdersPage() {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading, error } = useGetOrdersQuery(undefined, {
    skip: !user,
  });
  const [cancelOrder] = useCancelOrderMutation();

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("title")}</h2>
        {[...Array(3)].map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={tCommon("error")}
        message={t("errorLoadingOrders")}
        onRetry={() => window.location.reload()}
        retryLabel={tCommon("tryAgain")}
      />
    );
  }

  const orders = data?.data?.orders || [];

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(t("confirmCancel"))) return;
    try {
      await cancelOrder(orderId).unwrap();
    } catch (err) {
      alert(tCommon("error"));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600 mt-1">تتبع طلباتك وحالتها</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
          <EmptyState
            icon={ShoppingBag}
            title={t("noOrders")}
            description={t("noOrdersDescription")}
            actionLabel={tCommon("products")}
            actionHref="/products"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Status Bar */}
              <div className={`h-1 ${order.status === "delivered" ? "bg-gradient-to-r from-green-500 to-green-600" :
                  order.status === "shipped" ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                    order.status === "processing" ? "bg-gradient-to-r from-yellow-500 to-yellow-600" :
                      order.status === "confirmed" ? "bg-gradient-to-r from-purple-500 to-purple-600" :
                        order.status === "cancelled" ? "bg-gradient-to-r from-red-500 to-red-600" :
                          "bg-gradient-to-r from-gray-400 to-gray-500"
                }`} />

              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t("orderNumber")}</p>
                      <p className="font-mono font-bold text-gray-900">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {t(`statuses.${order.status}`)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">{t("orderDate")}</p>
                      <p className="font-medium text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">{tCommon("total")}</p>
                      <p className="font-bold text-sm text-gray-900">
                        {order.totalAmount} {tCommon("currency")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <ShoppingBag className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">{t("items")}</p>
                      <p className="font-medium text-sm text-gray-900">{order.items.length} منتجات</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <Button asChild variant="outline" size="sm" className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Link href={`/orders/${order._id}`}>
                      <Eye className="w-4 h-4 ml-1" />
                      {t("viewDetails")}
                    </Link>
                  </Button>
                  {order.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelOrder(order._id)}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 ml-1" />
                      {t("cancelOrder")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
