"use client";

import { ShoppingCart, Trash2, Plus, Minus, Package, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppSelector, useAppDispatch } from "@/store";
import { updateQuantity, removeItem } from "@/store/slices/cartSlice";
import { useState } from "react";

export function CartSheet() {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  const dispatch = useAppDispatch();
  
  const { items, totalAmount, totalItems } = useAppSelector((state) => state.cart);
  const [open, setOpen] = useState(false);

  const handleUpdateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    dispatch(updateQuantity({ productId, variantId, quantity }));
  };

  const handleRemoveItem = (productId: string, variantId: string | undefined) => {
    dispatch(removeItem({ productId, variantId }));
  };

  const getProductName = (item: typeof items[0]) => {
    const name = item.product.name;
    if (typeof name === "string") return name;
    return (name as any)?.[locale] || (name as any)?.ar || "";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">{tCommon("cart")}</span>
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side={locale === "ar" ? "left" : "right"} className="w-full sm:w-[420px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t("title")}
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems} {totalItems === 1 ? tCommon("product") : tCommon("products")}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("empty")}</h3>
              <p className="text-sm text-gray-500 mb-6">{t("emptyDescription")}</p>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/products">{t("continueShopping")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const productName = getProductName(item);
                const imageUrl = item.product.images?.[0] || "/placeholder.png";

                return (
                  <div key={`${item.product._id}-${item.variantId || "default"}`} className="flex gap-3 p-3 rounded-lg border bg-gray-50/50">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 bg-white">
                      <Image
                        src={imageUrl}
                        alt={productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {productName}
                      </h4>
                      
                      {/* Variant Info */}
                      {item.variant && (
                        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
                          {item.variant.size && (
                            <span className="bg-white px-2 py-0.5 rounded border">
                              {item.variant.size}
                            </span>
                          )}
                          {item.variant.color && (
                            <span className="bg-white px-2 py-0.5 rounded border">
                              {item.variant.color}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <span className="font-semibold text-primary">
                          {item.product.price} {tCommon("currency")}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 border rounded-md bg-white">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(item.product._id, item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(item.product._id, item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() => handleRemoveItem(item.product._id, item.variantId)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t("remove")}</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <>
            <Separator />
            <SheetFooter className="flex-col gap-4 sm:flex-col">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("subtotal")}</span>
                  <span className="font-medium">{totalAmount} {tCommon("currency")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("shipping")}</span>
                  <span className="text-sm text-gray-500">{t("calculated")}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>{t("total")}</span>
                  <span className="text-primary">{totalAmount} {tCommon("currency")}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" asChild onClick={() => setOpen(false)}>
                  <Link href="/cart">{t("viewCart")}</Link>
                </Button>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/checkout">{t("checkout")}</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
