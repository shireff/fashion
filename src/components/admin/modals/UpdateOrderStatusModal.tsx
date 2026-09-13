"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateOrderStatusMutation } from "@/store/api/adminApi";
import { Loader2 } from "lucide-react";
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

export function UpdateOrderStatusModal({
  order,
  isOpen,
  onClose,
}: UpdateOrderStatusModalProps) {
  const t = useTranslations();
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

  const [status, setStatus] = useState<OrderStatus | "">("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order || !status) return;

    try {
      await updateOrderStatus({
        id: order._id,
        data: { status, notes: note.trim() || undefined },
      }).unwrap();

      // Success - show success modal or toast
      onClose();

      // Reset form
      setStatus("");
      setNote("");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setStatus("");
      setNote("");
      onClose();
    }
  };

  if (!order) return null;

  const availableStatuses = STATUS_FLOW[order.status as OrderStatus] || [];
  const canUpdate = availableStatuses.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("orders.updateStatus")}</DialogTitle>
            <DialogDescription>
              {t("orders.orderNumber")}: {order.orderNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Status */}
            <div>
              <Label>{t("orders.currentStatus")}</Label>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {t(`orders.statuses.${order.status}`)}
                </span>
              </div>
            </div>

            {canUpdate ? (
              <>
                {/* New Status */}
                <div>
                  <Label htmlFor="status">
                    {t("orders.newStatus")} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder={t("orders.selectStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {t(`orders.statuses.${s}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Note */}
                <div>
                  <Label htmlFor="note">{t("orders.note")}</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t("orders.notePlaceholder")}
                    rows={3}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("orders.noteHint")}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-600">
                <p>
                  {order.status === "delivered"
                    ? t("orders.orderAlreadyDelivered")
                    : order.status === "cancelled"
                      ? t("orders.orderAlreadyCancelled")
                      : t("orders.noAvailableStatuses")}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            {canUpdate && (
              <Button type="submit" disabled={!status || isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                {t("common.save")}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
