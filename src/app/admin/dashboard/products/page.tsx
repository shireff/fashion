"use client";

import { useTranslations, useLocale } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setProductSearchQuery,
  setProductCurrentPage,
  openProductDeleteModal,
  closeProductDeleteModal,
} from "@/store";
import { useGetProductsQuery } from "@/store/api/productsApi";
import { useDeleteProductMutation } from "@/store/api/adminApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { getLocalizedText, getProductStock, getProductSKU } from "@/lib/utils/bilingual";

export default function ProductsManagementPage() {
  const t = useTranslations();
  const locale = useLocale() as "ar" | "en";
  const dispatch = useAppDispatch();
  const { searchQuery, currentPage, isDeleteModalOpen, productToDelete } = useAppSelector(
    (state) => state.adminProducts
  );

  const { data, isLoading } = useGetProductsQuery({
    search: searchQuery,
    page: currentPage,
    limit: 10,
  });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [successMessage, setSuccessMessage] = useState("");

  const products = data?.data?.products || [];
  const total = data?.data?.total || 0;
  const pageCount = data?.data?.pageCount || 1;

  // Helper function to get localized product name
  const getProductName = (product: typeof products[0]) => {
    return getLocalizedText(product.name, locale);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id).unwrap();
      setSuccessMessage(t("admin.productDeleted"));
      dispatch(closeProductDeleteModal());

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      dispatch(closeProductDeleteModal());
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("admin.productsManagement")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{t("admin.productsDescription")}</p>
          </div>
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          >
            <Link href="/admin/dashboard/products/new">
              <Plus className="w-5 h-5 ml-2" />
              {t("admin.addProduct")}
            </Link>
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t("admin.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => dispatch(setProductSearchQuery(e.target.value))}
              className="pr-10"
            />
          </div>
        </Card>

        {/* Products Table/Cards */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">{t("common.loading")}</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">{t("common.noProducts")}</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.productName")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.productPrice")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.productStock")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.productStatus")}
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
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={getProductName(product)}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{getProductName(product)}</p>
                              <p className="text-sm text-gray-500">
                                {t("admin.productSku")}: {getProductSKU(product) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold">
                          {product.price} {t("common.currency")}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`font-semibold ${getProductStock(product) < 5
                              ? "text-red-600"
                              : getProductStock(product) < 10
                                ? "text-orange-600"
                                : "text-green-600"
                              }`}
                          >
                            {getProductStock(product)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {product.isActive ? t("admin.active") : t("admin.inactive")}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/products/${product._id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/admin/dashboard/products/${product._id}`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                dispatch(
                                  openProductDeleteModal({ id: product._id, name: getProductName(product) })
                                )
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
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
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={getProductName(product)}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{getProductName(product)}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {t("admin.productSku")}: {getProductSKU(product) || "N/A"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-semibold text-purple-600">
                            {product.price} {t("common.currency")}
                          </span>
                          <span
                            className={`text-sm font-semibold ${getProductStock(product) < 5
                              ? "text-red-600"
                              : getProductStock(product) < 10
                                ? "text-orange-600"
                                : "text-green-600"
                              }`}
                          >
                            • {getProductStock(product)} {t("admin.productStock")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/products/${product._id}`}>
                          <Eye className="w-4 h-4 ml-1" />
                          {t("admin.view")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/admin/dashboard/products/${product._id}`}>
                          <Edit className="w-4 h-4 ml-1" />
                          {t("common.edit")}
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          dispatch(openProductDeleteModal({ id: product._id, name: getProductName(product) }))
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    {t("admin.showing")} {products.length} {t("admin.of")} {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(setProductCurrentPage(currentPage - 1))}
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
                      onClick={() => dispatch(setProductCurrentPage(currentPage + 1))}
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => dispatch(closeProductDeleteModal())}
        onConfirm={handleDeleteConfirm}
        title={t("admin.deleteProduct")}
        message={t("admin.confirmDeleteProduct", { name: productToDelete?.name || "" })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
