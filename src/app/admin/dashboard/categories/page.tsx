"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  openCategoryForm,
  closeCategoryForm,
  openCategoryDeleteModal,
  closeCategoryDeleteModal,
} from "@/store";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import {
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/store/api/adminApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Plus, Edit, Trash2, Save } from "lucide-react";

export default function CategoriesManagementPage() {
  const t = useTranslations();
  const locale = useLocale() as "ar" | "en";
  const dispatch = useAppDispatch();
  const { selectedCategory, isFormOpen, isDeleteModalOpen, categoryToDelete } = useAppSelector(
    (state) => state.adminCategories
  );

  const { data, isLoading } = useGetCategoriesQuery({});
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const categories = data?.data?.categories || [];

  // Helper function to get localized text
  const getLocalizedText = (text: any): string => {
    if (!text) return "";
    return typeof text === "string" ? text : text?.[locale] || text?.ar || "";
  };

  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    slug: "",
    parentId: "",
    isActive: true,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleOpenForm = (category?: typeof categories[0]) => {
    if (category) {
      const nameAr = getLocalizedText(category.name);
      const nameEn = typeof category.name === "object" ? category.name?.en || "" : "";
      const descAr = getLocalizedText(category.description);
      const descEn = typeof category.description === "object" ? category.description?.en || "" : "";
      const slugAr = getLocalizedText(category.slug);
      const slugEn = typeof category.slug === "object" ? category.slug?.en || "" : "";

      setFormData({
        name: nameEn,
        nameAr: nameAr,
        description: descEn,
        descriptionAr: descAr,
        slug: slugEn || slugAr,
        parentId:
          typeof category.parentId === "string"
            ? category.parentId
            : category.parentId?._id || "",
        isActive: category.isActive,
      });
      dispatch(openCategoryForm(category));
    } else {
      setFormData({
        name: "",
        nameAr: "",
        description: "",
        descriptionAr: "",
        slug: "",
        parentId: "",
        isActive: true,
      });
      dispatch(openCategoryForm(null));
    }
  };

  const handleCloseForm = () => {
    dispatch(closeCategoryForm());
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      slug: "",
      parentId: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Transform formData to match backend expectations
      const submitData: any = {
        isActive: formData.isActive,
      };

      // Convert bilingual fields to {ar, en} format
      if (formData.nameAr && formData.name) {
        submitData.name = { ar: formData.nameAr, en: formData.name };
      }
      if (formData.descriptionAr || formData.description) {
        submitData.description = {
          ar: formData.descriptionAr || "",
          en: formData.description || "",
        };
      }
      if (formData.slug) {
        submitData.slug = { ar: formData.slug, en: formData.slug };
      }
      if (formData.parentId) {
        submitData.parentId = formData.parentId;
      }

      if (selectedCategory) {
        await updateCategory({ id: selectedCategory._id, data: submitData }).unwrap();
        setSuccessMessage(t("admin.categoryUpdated"));
      } else {
        await createCategory(submitData).unwrap();
        setSuccessMessage(t("admin.categoryCreated"));
      }
      handleCloseForm();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      // Error handled by RTK Query
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      setSuccessMessage(t("admin.categoryDeleted"));
      dispatch(closeCategoryDeleteModal());
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      dispatch(closeCategoryDeleteModal());
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("admin.categoriesManagement")}
            </h1>
            <p className="text-sm text-gray-600 mt-1">{t("admin.categoriesDescription")}</p>
          </div>
          <Button
            onClick={() => handleOpenForm()}
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 ml-2" />
            {t("admin.addCategory")}
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Categories Table/Cards */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">{t("common.loading")}</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">{t("admin.noCategories")}</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.categoryName")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.categorySlug")}
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        {t("admin.parentCategory")}
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
                    {categories.map((category) => (
                      <tr key={category._id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 font-semibold">
                          {getLocalizedText(category.name)}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {getLocalizedText(category.slug)}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          {typeof category.parentId === "object" && category.parentId
                            ? getLocalizedText(category.parentId.name)
                            : t("admin.mainCategory")}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {category.isActive ? t("admin.active") : t("admin.inactive")}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenForm(category)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                dispatch(
                                  openCategoryDeleteModal({
                                    id: category._id,
                                    name: getLocalizedText(category.name),
                                  })
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
              <div className="md:hidden divide-y">
                {categories.map((category) => (
                  <div key={category._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getLocalizedText(category.name)}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {getLocalizedText(category.slug)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {typeof category.parentId === "object" && category.parentId
                            ? getLocalizedText(category.parentId.name)
                            : t("admin.mainCategory")}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${category.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {category.isActive ? t("admin.active") : t("admin.inactive")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenForm(category)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 ml-1" />
                        {t("common.edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          dispatch(
                            openCategoryDeleteModal({
                              id: category._id,
                              name: getLocalizedText(category.name),
                            })
                          )
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={selectedCategory ? t("admin.editCategory") : t("admin.addCategory")}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("admin.categoryNameEn")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameAr">{t("admin.categoryNameAr")}</Label>
              <Input
                id="nameAr"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="description">{t("admin.categoryDescriptionEn")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionAr">{t("admin.categoryDescriptionAr")}</Label>
              <Textarea
                id="descriptionAr"
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionAr: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="slug">{t("admin.categorySlug")}</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">{t("admin.parentCategory")}</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) => setFormData({ ...formData, parentId: value || "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("admin.noParentCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("admin.noParentCategory")}</SelectItem>
                  {categories
                    .filter((cat) => cat._id !== selectedCategory?._id)
                    .map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {getLocalizedText(category.name)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              {t("admin.categoryActive")}
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:flex-1"
            >
              <Save className="w-4 h-4 ml-2" />
              {isCreating || isUpdating ? t("admin.saving") : t("common.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseForm}
              disabled={isCreating || isUpdating}
              className="w-full sm:flex-1"
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => dispatch(closeCategoryDeleteModal())}
        onConfirm={handleDeleteConfirm}
        title={t("admin.deleteCategory")}
        message={t("admin.confirmDeleteCategory", { name: categoryToDelete?.name || "" })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
