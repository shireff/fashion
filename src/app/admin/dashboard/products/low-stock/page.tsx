"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGetLowStockProductsQuery } from "@/store/api/adminApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Package, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

export default function LowStockProductsPage() {
  const t = useTranslations();
  const [threshold, setThreshold] = useState(10);
  const [searchThreshold, setSearchThreshold] = useState(10);

  const { data, isLoading, error, refetch } = useGetLowStockProductsQuery({
    threshold: searchThreshold,
  });

  const products = data?.data?.products || [];
  const count = data?.data?.count || 0;

  const handleSearch = () => {
    setSearchThreshold(threshold);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {t("admin.lowStock.badges.outOfStock")}
        </span>
      );
    }
    if (stock <= 3) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {t("admin.lowStock.badges.critical")} ({stock})
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {t("admin.lowStock.badges.low")} ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {stock} {t("admin.inventory.pieces")}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("admin.lowStock.title")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t("admin.lowStock.description")}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/dashboard/products">
            <ArrowRight className="w-4 h-4 ml-2" />
            {t("admin.backToProducts")}
          </Link>
        </Button>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="threshold">{t("admin.lowStock.threshold")}</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              min={1}
              className="mt-1.5"
              placeholder={t("admin.inventory.quantityPlaceholder")}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("admin.lowStock.thresholdHint")}
            </p>
          </div>
          <Button onClick={handleSearch}>{t("admin.lowStock.search")}</Button>
        </div>
      </Card>

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
            icon={Package}
            title={t("admin.lowStock.noProducts")}
            description={t("admin.lowStock.noProductsDesc")}
          />
        ) : (
          <>
            {/* Header Info */}
            <div className="p-4 border-b bg-yellow-50 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">
                {t("admin.lowStock.foundCount", { count })}
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">
                      المنتج
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">
                      الفئة
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">
                      المخزون
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">
                      السعر
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">
                      {t("admin.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const totalStock = product.variants?.reduce(
                      (sum, v) => sum + v.quantity,
                      0
                    ) || product.stock || 0;

                    return (
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
                                {typeof product.name === "string"
                                  ? product.name
                                  : product.name.ar}
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
                        <td className="py-4 px-6">{getStockBadge(totalStock)}</td>
                        <td className="py-4 px-6 font-semibold">
                          {product.price} {t("common.currency")}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/dashboard/products/${product._id}`}>
                                تعديل
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y">
              {products.map((product) => {
                const totalStock = product.variants?.reduce(
                  (sum, v) => sum + v.quantity,
                  0
                ) || product.stock || 0;

                return (
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
                          {getStockBadge(totalStock)}
                          <span className="text-sm font-semibold text-purple-600">
                            {product.price} {t("common.currency")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/admin/dashboard/products/${product._id}`}>
                        تعديل المنتج
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
