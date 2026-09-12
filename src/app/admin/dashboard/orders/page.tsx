"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setStatusFilter, setOrderCurrentPage, openStatusModal, closeStatusModal } from "@/store";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/store/api/adminApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Eye, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OrdersManagementPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { statusFilter, currentPage, isStatusModalOpen, orderToUpdate } = useAppSelector(
    (state) => state.adminOrders
  );

  const { data, isLoading } = useGetAllOrdersQuery({
    page: currentPage,
    limit: 10,
    status: statusFilter || undefined,
  });
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");

  const orders = data?.data?.orders || [];
  const total = data?.data?.total || 0;
  const pageCount = data?.data?.pageCount || 1;

  const statuses: Array<"pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"> = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const handleUpdateConfirm = async () => {
    if (!orderToUpdate || !selectedStatus) return;

    try {
      await updateOrderStatus({
        id: orderToUpdate.id,
        data: { status: selectedStatus as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" }
      }).unwrap();
      setSuccessMessage(t("admin.orderUpdated"));
      dispatch(closeStatusModal());
      setSelectedStatus("");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      dispatch(closeStatusModal());
      setSelectedStatus("");
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("admin.ordersManagement")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{t("admin.ordersDescription")}</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Filter */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Label className="font-medium whitespace-nowrap">{t("orders.status")}:</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => dispatch(setStatusFilter(value || ""))}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("admin.searchPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("common.viewAll")}</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`orders.statuses.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Orders Table/Cards */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">{t("common.loading")}</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">{t("orders.noOrders")}</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("orders.orderNumber")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.customer")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("common.total")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("orders.status")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("orders.orderDate")}
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        {t("admin.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
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
                          <button
                            onClick={() => {
                              dispatch(
                                openStatusModal({ id: order._id, currentStatus: order.status })
                              );
                              setSelectedStatus(order.status);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${order.status === "delivered"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }`}
                          >
                            {t(`orders.statuses.${order.status}`)}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/account/orders/${order._id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y">
                {orders.map((order) => (
                  <div key={order._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm text-gray-600">{order.orderNumber}</p>
                        <p className="font-semibold text-gray-900 mt-1">
                          {typeof order.userId === "object" && order.userId
                            ? `${order.userId.firstName} ${order.userId.lastName}`
                            : typeof order.user === "object" && order.user
                              ? `${order.user.firstName} ${order.user.lastName}`
                              : "N/A"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                      <p className="font-bold text-purple-600">
                        {order.totalAmount} {t("common.currency")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          dispatch(
                            openStatusModal({ id: order._id, currentStatus: order.status })
                          );
                          setSelectedStatus(order.status);
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {t(`orders.statuses.${order.status}`)}
                      </button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/account/orders/${order._id}`}>
                          <Eye className="w-4 h-4 ml-1" />
                          {t("admin.view")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    {t("admin.showing")} {orders.length} {t("admin.of")} {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(setOrderCurrentPage(currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      {t("admin.previous")}
                    </Button>
                    <span className="px-4 py-2 text-sm">
                      {t("admin.page")} {currentPage} {t("admin.of")} {pageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(setOrderCurrentPage(currentPage + 1))}
                      disabled={currentPage === pageCount}
                    >
                      {t("admin.next")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => {
          dispatch(closeStatusModal());
          setSelectedStatus("");
        }}
        title={t("admin.updateOrderStatus")}
        size="sm"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{t("orders.status")}</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value || "")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`orders.statuses.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleUpdateConfirm}
              disabled={isUpdating || selectedStatus === orderToUpdate?.currentStatus}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              {isUpdating ? t("admin.saving") : t("common.save")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(closeStatusModal());
                setSelectedStatus("");
              }}
              disabled={isUpdating}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
