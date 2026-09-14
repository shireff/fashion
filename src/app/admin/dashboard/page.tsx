"use client";

import { useTranslations } from "next-intl";
import { useGetStatisticsQuery } from "@/store/api/adminApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingCart, Package, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { InstallPWAButton } from "@/components/admin/InstallPWAButton";

export default function AdminDashboardPage() {
  const t = useTranslations();
  const { data, isLoading, error } = useGetStatisticsQuery();

  // Show error details on iPhone
  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <h2 className="text-xl font-bold text-red-900 mb-4">API Error</h2>
          <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto max-h-96 bg-white p-4 rounded">
            {JSON.stringify(error, null, 2)}
          </pre>
        </Card>
      </div>
    );
  }

  const stats = data?.data;

  const statsCards = [
    {
      title: t("admin.totalRevenue"),
      value: stats?.totalRevenue || 0,
      suffix: ` ${t("common.currency")}`,
      icon: DollarSign,
      color: "from-green-600 to-emerald-600",
    },
    {
      title: t("admin.totalOrders"),
      value: stats?.totalOrders || 0,
      suffix: "",
      icon: ShoppingCart,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: t("admin.totalProducts"),
      value: stats?.totalProducts || 0,
      suffix: "",
      icon: Package,
      color: "from-purple-600 to-pink-600",
    },
    {
      title: t("admin.totalCustomers"),
      value: stats?.totalUsers || 0,
      suffix: "",
      icon: Users,
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t("admin.dashboard")}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">{t("admin.statistics")}</p>
        </div>
        <InstallPWAButton />
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-12 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                      {stat.value.toLocaleString()}
                      {stat.suffix}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0 ml-3`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recent Orders */}
      <Card className="overflow-hidden">
        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t("admin.recentOrders")}</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {stats?.recentOrders.length || 0} {t("orders.items")}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href="/admin/dashboard/orders" className="flex items-center justify-center gap-2">
              {t("admin.viewAllOrders")}
              <ArrowRight className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 sm:p-12 text-center text-sm sm:text-base text-gray-500">{t("common.loading")}</div>
        ) : !stats?.recentOrders.length ? (
          <div className="p-8 sm:p-12 text-center text-sm sm:text-base text-gray-500">{t("orders.noOrders")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-6 font-semibold text-gray-700 text-xs sm:text-sm">
                    {t("orders.orderNumber")}
                  </th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-6 font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">
                    {t("admin.customer")}
                  </th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-6 font-semibold text-gray-700 text-xs sm:text-sm">
                    {t("common.total")}
                  </th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-6 font-semibold text-gray-700 text-xs sm:text-sm">
                    {t("orders.orderStatus")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-mono text-xs sm:text-sm">
                      <div className="truncate max-w-[100px] sm:max-w-none">{order.orderNumber}</div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">
                      <div className="truncate">
                        {typeof order.userId === "object" && order.userId
                          ? `${order.userId.firstName} ${order.userId.lastName}`
                          : typeof order.user === "object" && order.user
                            ? `${order.user.firstName} ${order.user.lastName}`
                            : "N/A"}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-xs sm:text-sm whitespace-nowrap">
                      {order.totalAmount} {t("common.currency")}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {t(`orders.statuses.${order.status}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
