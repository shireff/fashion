"use client";

import { use } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useGetOrderByIdAdminQuery, useUpdateAdminNotesMutation } from "@/store/api/adminApi";
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
  Edit,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import { UpdateOrderStatusModal } from "@/components/admin/modals/UpdateOrderStatusModal";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Order, OrderItem, StatusHistory, Address } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface OrderStatusConfig {
  color: string;
  icon: typeof Clock;
  label: string;
}

export default function AdminOrderDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const { data, isLoading, error } = useGetOrderByIdAdminQuery(id);
  const [updateAdminNotes, { isLoading: isUpdating }] = useUpdateAdminNotesMutation();

  const order = data?.data?.order;

  // Order status colors and icons
  const getStatusConfig = (status: string): OrderStatusConfig => {
    const configs: Record<string, OrderStatusConfig> = {
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
    return configs[status] || configs.pending;
  };

  const handleSaveNotes = async () => {
    if (!order || !adminNotes.trim()) return;

    try {
      await updateAdminNotes({
        id: order._id,
        adminNotes: adminNotes.trim(),
      }).unwrap();
      setIsNotesModalOpen(false);
      setAdminNotes("");
    } catch (err) {
      console.error("Failed to update notes:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t("admin.errorOrders")}
        message={t("admin.errorOrdersDescription")}
        onRetry={() => window.location.reload()}
        retryLabel={t("common.tryAgain")}
        homeLabel={t("admin.backToOrders")}
        showHomeButton={false}
      />
    );
  }

  if (!order) {
    return (
      <EmptyState
        icon={XCircle}
        title={t("orders.orderNotFound")}
        description={t("orders.orderNotFoundDescription")}
        actionLabel={t("orders.backToOrders")}
        actionHref="/admin/dashboard/orders"
      />
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  // Get customer info
  const customer = typeof order.userId === "object" && order.userId
    ? order.userId
    : typeof order.user === "object" && order.user
      ? order.user
      : null;

  // Type guard for shipping address
  const shippingAddress = typeof order.shippingAddress === "object"
    ? order.shippingAddress
    : null;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/dashboard/orders")}
            className="gap-2"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            {t("admin.backToOrders")}
          </Button>
        </div>

        {/* Order Header */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t("orders.orderNumber")}: {order.orderNumber}
              </h1>
              <p className="text-sm text-gray-600 mb-3">
                {t("orders.orderDate")}:{" "}
                {format(new Date(order.createdAt), "PPP", {
                  locale: isRTL ? ar : undefined,
                })}
              </p>
              {customer && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>
                    {customer.firstName} {customer.lastName}
                  </span>
                  {customer.email && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span>{customer.email}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color} font-medium`}
              >
                <StatusIcon className="w-5 h-5" />
                {statusConfig.label}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsStatusModalOpen(true)}
                  size="sm"
                  className="gap-2"
                  disabled={order.status === "delivered" || order.status === "cancelled"}
                >
                  <Edit className="w-4 h-4" />
                  {t("orders.updateStatus")}
                </Button>

                <Button
                  onClick={() => setIsNotesModalOpen(true)}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {t("admin.notes.addTitle")}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Admin Notes */}
        {order.adminNotes && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t("admin.notes.privateNote")}
            </h2>
            <p className="text-blue-800 whitespace-pre-wrap">{order.adminNotes}</p>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Items */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-600" />
              {t("orders.orderItems")}
            </h2>

            <div className="space-y-4">
              {order.items && order.items.map((item: OrderItem, index: number) => (
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

            {shippingAddress && (
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{shippingAddress.recipientName}</p>
                    <p className="text-sm text-gray-600">{t("orders.recipient")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium" dir="ltr">
                      {shippingAddress.recipientPhone}
                    </p>
                    <p className="text-sm text-gray-600">{t("orders.phone")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {shippingAddress.streetAddress}
                      {shippingAddress.buildingNumber &&
                        `, ${t("address.building")} ${shippingAddress.buildingNumber}`}
                      {shippingAddress.floorNumber &&
                        `, ${t("address.floor")} ${shippingAddress.floorNumber}`}
                      {shippingAddress.apartmentNumber &&
                        `, ${t("address.apartment")} ${shippingAddress.apartmentNumber}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {shippingAddress.area && `${shippingAddress.area}, `}
                      {shippingAddress.city}, {shippingAddress.governorate}
                    </p>
                    {shippingAddress.landmark && (
                      <p className="text-sm text-gray-600">
                        {t("address.landmark")}: {shippingAddress.landmark}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Payment & Customer Notes */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-purple-600" />
              {t("orders.paymentMethod")}
            </h2>
            <p className="text-gray-700 mb-6">{t("orders.cashOnDelivery")}</p>

            {order.notes && (
              <>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("orders.notes")} ({t("admin.customer")}):
                </h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
              </>
            )}
          </Card>
        </div>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-600" />
              {t("orders.statusHistory")}
            </h2>

            <div className="space-y-4">
              {order.statusHistory.map((history: StatusHistory, index: number) => {
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
                        <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                          {history.note}
                        </p>
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

      {/* Update Status Modal */}
      <UpdateOrderStatusModal
        order={order}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      {/* Admin Notes Dialog */}
      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.notes.addTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {t("admin.notes.privateNote")}
            </p>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t("admin.notes.notePlaceholder")}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {t("admin.notes.noteHint")}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsNotesModalOpen(false);
                  setAdminNotes("");
                }}
                disabled={isUpdating}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleSaveNotes}
                disabled={isUpdating || !adminNotes.trim()}
              >
                {isUpdating ? t("admin.saving") : t("common.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
