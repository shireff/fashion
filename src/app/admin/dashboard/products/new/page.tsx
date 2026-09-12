"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCreateProductMutation } from "@/store/api/adminApi";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ArrowRight, Save, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getErrorMessage } from "@/lib/utils/errorHandler";

export default function NewProductPage() {
  const t = useTranslations();
  const router = useRouter();

  const { data: categoriesData } = useGetCategoriesQuery({});
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: 0,
    categoryId: "",
    stock: 0,
    sku: "",
    images: [] as string[],
    isActive: true,
    isFeatured: false,
  });

  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProduct(formData).unwrap();
      setModal({
        isOpen: true,
        type: "success",
        message: t("admin.productCreated"),
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin/dashboard/products");
      }, 2000);
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        message: getErrorMessage(error as never, t("admin.productCreateFailed")),
      });
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="hidden sm:flex">
            <Link href="/admin/dashboard/products">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("admin.addProduct")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{t("admin.productsDescription")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t("admin.basicInfo")}</h2>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.productNameEn")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nameAr">{t("admin.productNameAr")}</Label>
                <Input
                  id="nameAr"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="space-y-2">
                <Label htmlFor="description">{t("admin.productDescriptionEn")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionAr">{t("admin.productDescriptionAr")}</Label>
                <Textarea
                  id="descriptionAr"
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
              {t("admin.pricingStock")}
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">
                  {t("admin.productPrice")} ({t("common.currency")})
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">{t("admin.productStock")}</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">{t("admin.productSku")}</Label>
                <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
              {t("admin.categoryStatus")}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="categoryId">{t("admin.productCategory")}</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value || "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {t("admin.productActive")}
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    {t("admin.productFeatured")}
                  </Label>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              <Save className="w-5 h-5 ml-2" />
              {isLoading ? t("admin.saving") : t("common.save")}
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/admin/dashboard/products">{t("common.cancel")}</Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Success/Error Modal */}
      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} size="sm">
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${modal.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}
          >
            {modal.type === "success" ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {modal.type === "success" ? t("common.success") : t("common.error")}
            </h3>
            <p className="text-gray-600">{modal.message}</p>
          </div>
          <Button
            onClick={() => setModal({ ...modal, isOpen: false })}
            className={`w-full ${modal.type === "success"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {t("common.close")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
