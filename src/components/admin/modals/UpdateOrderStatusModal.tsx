"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateOrderStatusMutation } from "@/store/api/adminApi";
import {
  Loader2,
  Clock,
  CheckCircle,
  Package,
  Truck,
  Home,
  XCircle,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/types";

interface UpdateOrderStatusModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

interface StatusOption {
  value: OrderStatus;
  icon: typeof Clock;
  color: string;
  bgColor: string;
  hoverColor: string;
  description: string;
}

export function UpdateOrderStatusModal({
  order,
  isOpen,
  onClose,
}: UpdateOrderStatusModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [note, setNote] = useState("");

  const getStatusConfig = (status: OrderStatus): StatusOption => {
    const configs: Record<OrderStatus, StatusOption> = {
      pending: {
        value: "pending",
        icon: Clock,
        color: "text-yellow-700",
        bgColor: "bg-yellow-50 border-yellow-200",
        hoverColor: "hover:bg-yellow-100 hover:border-yellow-300",
        description: isRTL ? "الطلب في انتظار المراجعة" : "Order awaiting review",
      },
      confirmed: {
        value: "confirmed",
        icon: CheckCircle,
        color: "text-blue-700",
        bgColor: "bg-blue-50 border-blue-200",
        hoverColor: "hover:bg-blue-100 hover:border-blue-300",
        description: isRTL ? "تم تأكيد الطلب وجاري المعالجة" : "Order confirmed and processing",
      },
      processing: {
        value: "processing",
        icon: Package,
        color: "text-purple-700",
        bgColor: "bg-purple-50 border-purple-200",
        hoverColor: "hover:bg-purple-100 hover:border-purple-300",
        description: isRTL ? "جاري تجهيز الطلب للشحن" : "Order being prepared for shipping",
      },
      shipped: {
        value: "shipped",
        icon: Truck,
        color: "text-indigo-700",
        bgColor: "bg-indigo-50 border-indigo-200",
        hoverColor: "hover:bg-indigo-100 hover:border-indigo-300",
        description: isRTL ? "الطلب في الطريق إليك" : "Order is on the way",
      },
      delivered: {
        value: "delivered",
        icon: Home,
        color: "text-green-700",
        bgColor: "bg-green-50 border-green-200",
        hoverColor: "hover:bg-green-100 hover:border-green-300",
        description: isRTL ? "تم توصيل الطلب بنجاح" : "Order delivered successfully",
      },
      cancelled: {
        value: "cancelled",
        icon: XCircle,
        color: "text-red-700",
        bgColor: "bg-red-50 border-red-200",
        hoverColor: "hover:bg-red-100 hover:border-red-300",
        description: isRTL ? "تم إلغاء الطلب" : "Order has been cancelled",
      },
    };
    return configs[status];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order || !selectedStatus) return;

    try {
      await updateOrderStatus({
        id: order._id,
        data: { status: selectedStatus, notes: note.trim() || undefined },
      }).unwrap();

      toast.success(
        isRTL
          ? `تم تحديث حالة الطلب إلى ${t(`orders.statuses.${selectedStatus}`)}`
          : `Order status updated to ${t(`orders.statuses.${selectedStatus}`)}`
      );

      onClose();
      setSelectedStatus("");
      setNote("");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error(
        isRTL
          ? "فشل تحديث حالة الطلب. حاول مرة أخرى."
          : "Failed to update order status. Please try again."
      );
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedStatus("");
      setNote("");
      onClose();
    }
  };

  if (!order) return null;

  const currentConfig = getStatusConfig(order.status as OrderStatus);
  const CurrentIcon = currentConfig.icon;

  const availableStatuses = STATUS_FLOW[order.status as OrderStatus] || [];
  const canUpdate = availableStatuses.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">{t("orders.updateStatus")}</DialogTitle>
            <DialogDescription className="text-base">
              {t("orders.orderNumber")}: <span className="font-mono font-semibold">{order.orderNumber}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Current Status */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                {t("orders.currentStatus")}
              </Label>
              <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${currentConfig.bgColor}`}>
                <div className={`p-2 rounded-lg bg-white ${currentConfig.color}`}>
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${currentConfig.color}`}>
                    {t(`orders.statuses.${order.status}`)}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {currentConfig.description}
                  </p>
                </div>
              </div>
            </div>

            {canUpdate ? (
              <>
                {/* Available Next Statuses */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    {t("orders.newStatus")} <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-3">
                    {availableStatuses.map((status) => {
                      const config = getStatusConfig(status);
                      const Icon = config.icon;
                      const isSelected = selectedStatus === status;

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setSelectedStatus(status)}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${isSelected
                              ? `${config.bgColor} border-current ring-2 ring-offset-2 ${config.color.replace('text-', 'ring-')}`
                              : `bg-white border-gray-200 ${config.hoverColor}`
                            }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : config.bgColor} ${config.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-right">
                            <p className={`font-semibold ${isSelected ? config.color : 'text-gray-900'}`}>
                              {t(`orders.statuses.${status}`)}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {config.description}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle className={`w-5 h-5 ${config.color}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Status Flow Visual */}
                  {selectedStatus && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className={`font-medium ${currentConfig.color}`}>
                          {t(`orders.statuses.${order.status}`)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className={`font-medium ${getStatusConfig(selectedStatus).color}`}>
                          {t(`orders.statuses.${selectedStatus}`)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Note */}
                <div>
                  <Label htmlFor="note" className="text-base font-semibold mb-3 block">
                    {t("orders.note")} <span className="text-gray-400 text-sm font-normal">({t("common.optional")})</span>
                  </Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t("orders.notePlaceholder")}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{t("orders.noteHint")}</span>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                  {order.status === "delivered"
                    ? t("orders.orderAlreadyDelivered")
                    : order.status === "cancelled"
                      ? t("orders.orderAlreadyCancelled")
                      : t("orders.noAvailableStatuses")}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            {canUpdate && (
              <Button
                type="submit"
                disabled={!selectedStatus || isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                {t("common.save")}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
