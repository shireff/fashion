"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useAppSelector } from "@/store";
import { useGetOrdersQuery, useCancelOrderMutation } from "@/store/api/ordersApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { OrderCardSkeleton } from "@/components/skeletons";

export default function OrdersPage() {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading, error } = useGetOrdersQuery(undefined, {
    skip: !user,
  });
  const [cancelOrder] = useCancelOrderMutation();

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
        <h1 className="text-5xl font-bold mb-12">{t("title")}</h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20">
        <ErrorState
          title={tCommon("error")}
          message={t("errorLoadingOrders")}
          onRetry={() => window.location.reload()}
          retryLabel={tCommon("tryAgain")}
          homeLabel={tCommon("backHome")}
        />
      </div>
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

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">{t("title")}</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={t("noOrders")}
          description={t("noOrdersDescription")}
          actionLabel={tCommon("products")}
          actionHref="/products"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("orderNumber")}</p>
                  <p className="font-mono font-bold">{order.orderNumber}</p>
                </div>
                <Badge variant={getStatusVariant(order.status)}>
                  {t(`statuses.${order.status}`)}
                </Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">{t("orderDate")}</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">{tCommon("total")}</p>
                  <p className="font-medium">
                    {order.totalAmount} {tCommon("currency")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">{t("items")}</p>
                  <p className="font-medium">{order.items.length}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/orders/${order._id}`}>{t("viewDetails")}</Link>
                </Button>
                {order.status === "pending" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    {t("cancelOrder")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
