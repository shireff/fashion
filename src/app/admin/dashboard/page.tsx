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
  const { data, isLoading } = useGetStatisticsQuery();

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("admin.dashboard")}</h1>
          <p className="text-gray-600 mt-1">{t("admin.statistics")}</p>
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
              <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                      {stat.suffix}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recent Orders */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t("admin.recentOrders")}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {stats?.recentOrders.length || 0} {t("orders.items")}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/orders">
              {t("admin.viewAllOrders")}
              <ArrowRight className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">{t("common.loading")}</div>
        ) : !stats?.recentOrders.length ? (
          <div className="p-12 text-center text-gray-500">{t("orders.noOrders")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-3 px-6 font-semibold text-gray-700">
                    {t("orders.orderNumber")}
                  </th>
                  <th className="text-right py-3 px-6 font-semibold text-gray-700">
                    {t("admin.customer")}
                  </th>
                  <th className="text-right py-3 px-6 font-semibold text-gray-700">
                    {t("common.total")}
                  </th>
                  <th className="text-right py-3 px-6 font-semibold text-gray-700">
                    {t("orders.orderStatus")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-4 px-6">
                      {typeof order.userId === "object" && order.userId
                        ? `${order.userId.firstName} ${order.userId.lastName}`
                        : typeof order.user === "object" && order.user
                          ? `${order.user.firstName} ${order.user.lastName}`
                          : "N/A"}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      {order.totalAmount} {t("common.currency")}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered"
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
