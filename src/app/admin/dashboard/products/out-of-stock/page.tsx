"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGetOutOfStockProductsQuery } from "@/store/api/adminApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageX, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { UpdateInventoryModal } from "@/components/admin/modals/UpdateInventoryModal";
import type { Product } from "@/types";

export default function OutOfStockProductsPage() {
  const t = useTranslations();
  const { data, isLoading, error, refetch } = useGetOutOfStockProductsQuery();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const products = data?.data?.products || [];
  const count = data?.data?.count || 0;

  const handleQuickRestock = (product: Product) => {
    setSelectedProduct(product);
    setIsInventoryModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("admin.outOfStock.title")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {t("admin.outOfStock.description")}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/products">
              <ArrowRight className="w-4 h-4 ml-2" />
              {t("admin.backToProducts")}
            </Link>
          </Button>
        </div>

        {/* Products */}
        <Card>
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">{t("common.loading")}</div>
          ) : error ? (
            <ErrorState
              title={t("admin.errorProducts")}
              message={t("admin.errorProductsDescription")}
              onRetry={() => refetch()}
              retryLabel={t("common.tryAgain")}
              homeLabel={t("common.backHome")}
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title={t("admin.outOfStock.noProducts")}
              description={t("admin.outOfStock.noProductsDesc")}
            />
          ) : (
            <>
              {/* Header Info */}
              <div className="p-4 border-b bg-red-50 flex items-center gap-3">
                <PackageX className="w-5 h-5 text-red-600" />
                <p className="text-sm font-medium text-red-800">
                  {t("admin.outOfStock.foundCount", { count })}
                </p>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.product")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.category")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.price")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.status")}
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        {t("admin.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {product.images?.[0] && (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={product.images[0]}
                                  alt={typeof product.name === "string" ? product.name : product.name.ar}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {typeof product.name === "string" ? product.name : product.name.ar}
                              </p>
                              <p className="text-sm text-gray-500">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {typeof product.categoryId === "object" && product.categoryId
                            ? typeof product.categoryId.name === "string"
                              ? product.categoryId.name
                              : product.categoryId.name?.ar || "N/A"
                            : "N/A"}
                        </td>
                        <td className="py-4 px-6 font-semibold">
                          {product.price} {t("common.currency")}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {t("admin.outOfStock.badge")}
                            </span>
                            {!product.isActive && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {t("admin.disabled")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleQuickRestock(product)}
                            >
                              {t("admin.outOfStock.restock")}
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/dashboard/products/${product._id}`}>
                                {t("admin.edit")}
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
                {products.map((product) => (
                  <div key={product._id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      {product.images?.[0] && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={typeof product.name === "string" ? product.name : product.name.ar}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {typeof product.name === "string" ? product.name : product.name.ar}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{product.sku}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {t("admin.outOfStock.badge")}
                          </span>
                          <span className="text-sm font-semibold text-purple-600">
                            {product.price} {t("common.currency")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleQuickRestock(product)}
                      >
                        {t("admin.outOfStock.restock")}
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/admin/dashboard/products/${product._id}`}>
                          {t("admin.edit")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Update Inventory Modal */}
      <UpdateInventoryModal
        product={selectedProduct}
        isOpen={isInventoryModalOpen}
        onClose={() => {
          setIsInventoryModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
}
