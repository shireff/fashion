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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateInventoryMutation } from "@/store/api/adminApi";
import type { Product } from "@/types";

interface UpdateInventoryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateInventoryModal({
  product,
  isOpen,
  onClose,
}: UpdateInventoryModalProps) {
  const t = useTranslations();
  const [updateInventory, { isLoading }] = useUpdateInventoryMutation();

  // Initialize with function to avoid cascading renders
  const [selectedVariant, setSelectedVariant] = useState(() => {
    if (product?.variants && product.variants.length === 1) {
      return product.variants[0].sku;
    }
    return "";
  });
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product || !selectedVariant || !quantity) return;

    try {
      await updateInventory({
        id: product._id,
        variantSku: selectedVariant,
        quantity: Number(quantity),
        reason: reason || undefined,
      }).unwrap();

      // Reset form after success
      setSelectedVariant("");
      setQuantity("");
      setReason("");
      onClose();
    } catch (error) {
      console.error("Failed to update inventory:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      // Reset form on close
      setSelectedVariant("");
      setQuantity("");
      setReason("");
      onClose();
    }
  };

  if (!product) return null;

  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("admin.inventory.updateTitle")}</DialogTitle>
            <DialogDescription>
              {typeof product.name === "string" ? product.name : product.name.ar}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Variant Selection */}
            {hasVariants && (
              <div>
                <Label htmlFor="variant">
                  {t("admin.inventory.variant")} <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedVariant} onValueChange={(value) => setSelectedVariant(value || "")}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={t("admin.inventory.selectVariant")} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants!.map((variant) => (
                      <SelectItem key={variant.sku} value={variant.sku}>
                        {variant.size && `${t("product.size")}: ${variant.size}`}
                        {variant.size && variant.color && " - "}
                        {variant.colorNameAr && `${t("product.color")}: ${variant.colorNameAr}`}
                        {" - "}
                        {t("admin.inventory.currentStock")}: {variant.quantity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Current Stock Display */}
            {selectedVariant && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-600">{t("admin.inventory.currentStock")}:</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hasVariants
                    ? product.variants!.find((v) => v.sku === selectedVariant)?.quantity || 0
                    : product.stock || 0}{" "}
                  {t("admin.inventory.pieces")}
                </p>
              </div>
            )}

            {/* New Quantity */}
            <div>
              <Label htmlFor="quantity">
                {t("admin.inventory.newQuantity")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min={0}
                className="mt-1.5"
                placeholder={t("admin.inventory.quantityPlaceholder")}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("admin.inventory.quantityHint")}
              </p>
            </div>

            {/* Reason */}
            <div>
              <Label htmlFor="reason">{t("admin.inventory.reason")}</Label>
              <Select value={reason} onValueChange={(value) => setReason(value || "")}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder={t("admin.inventory.selectReason")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("admin.inventory.noReason")}</SelectItem>
                  <SelectItem value="restock">{t("admin.inventory.reasons.restock")}</SelectItem>
                  <SelectItem value="return">{t("admin.inventory.reasons.return")}</SelectItem>
                  <SelectItem value="damage">{t("admin.inventory.reasons.damage")}</SelectItem>
                  <SelectItem value="theft">{t("admin.inventory.reasons.theft")}</SelectItem>
                  <SelectItem value="adjustment">{t("admin.inventory.reasons.adjustment")}</SelectItem>
                  <SelectItem value="initial">{t("admin.inventory.reasons.initial")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Button
              type="submit"
              disabled={!selectedVariant || !quantity || isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
