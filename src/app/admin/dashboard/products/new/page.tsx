/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useCreateProductMutation } from "@/store/api/adminApi";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ArrowRight, Save, CheckCircle, AlertCircle, Plus, Trash2, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { getLocalizedText } from "@/lib/utils/bilingual";
import { storage } from "@/lib/utils/storage";
import Image from "next/image";

interface Variant {
  id: string;
  color: string;
  colorNameAr: string;
  colorNameEn: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
  quantity: number;
  sku: string;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;

const COLORS = [
  { hex: "#000000", ar: "أسود", en: "Black" },
  { hex: "#FFFFFF", ar: "أبيض", en: "White" },
  { hex: "#FF0000", ar: "أحمر", en: "Red" },
  { hex: "#0000FF", ar: "أزرق", en: "Blue" },
  { hex: "#008000", ar: "أخضر", en: "Green" },
  { hex: "#FFFF00", ar: "أصفر", en: "Yellow" },
  { hex: "#FFC0CB", ar: "وردي", en: "Pink" },
  { hex: "#800080", ar: "بنفسجي", en: "Purple" },
  { hex: "#FFA500", ar: "برتقالي", en: "Orange" },
  { hex: "#A52A2A", ar: "بني", en: "Brown" },
  { hex: "#808080", ar: "رمادي", en: "Gray" },
  { hex: "#00FFFF", ar: "سماوي", en: "Cyan" },
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateSKU(productName: string, color: string, size: string): string {
  const namePrefix = productName
    .substring(0, 3)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const timestamp = Date.now().toString(36).toUpperCase().substring(-4);
  return `${namePrefix || "PRD"}-${color}-${size}-${timestamp}`;
}

async function uploadToCloudinary(file: File): Promise<string> {
  // Convert file to base64
  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Upload to backend which uploads to Cloudinary
  const token = storage.getItem("token") || "";
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      image: base64,
      folder: "products",
    }),
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return data.data.url;
}

export default function NewProductPage() {
  const t = useTranslations();
  const locale = (useLocale() || "ar") as "ar" | "en";
  const router = useRouter();

  const { data: categoriesData } = useGetCategoriesQuery({});
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const categories = categoriesData?.data?.categories || [];

  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    materialEn: "",
    materialAr: "",
    careInstructionsEn: "",
    careInstructionsAr: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);

  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 3 - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setUploadingImages(true);

    try {
      const uploadPromises = filesToUpload.map((file) => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (error) {
      setModal({
        isOpen: true,
        type: "error",
        message: t("admin.uploadFailed"),
      });
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      color: "#000000",
      colorNameAr: "أسود",
      colorNameEn: "Black",
      size: "M",
      quantity: 0,
      sku: generateSKU(formData.nameEn || "Product", "000000", "M"),
    };
    setVariants([...variants, newVariant]);
  };

  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    setVariants(
      variants.map((variant) => {
        if (variant.id === id) {
          const updated = { ...variant, [field]: value };

          // Auto-update color names when color hex changes
          if (field === "color") {
            const colorData = COLORS.find((c) => c.hex === value);
            if (colorData) {
              updated.colorNameAr = colorData.ar;
              updated.colorNameEn = colorData.en;
            }
          }

          // Auto-generate SKU when color or size changes
          if (field === "color" || field === "size") {
            updated.sku = generateSKU(
              formData.nameEn || "Product",
              updated.color.replace("#", ""),
              updated.size
            );
          }

          return updated;
        }
        return variant;
      })
    );
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (images.length === 0) {
      setModal({
        isOpen: true,
        type: "error",
        message: t("admin.atLeastOneImage"),
      });
      return;
    }

    if (variants.length === 0) {
      setModal({
        isOpen: true,
        type: "error",
        message: t("admin.atLeastOneVariant"),
      });
      return;
    }

    try {
      const payload = {
        name: {
          ar: formData.nameAr,
          en: formData.nameEn,
        },
        slug: {
          ar: generateSlug(formData.nameAr),
          en: generateSlug(formData.nameEn),
        },
        description: {
          ar: formData.descriptionAr,
          en: formData.descriptionEn,
        },
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : undefined,
        images,
        variants: variants.map((v) => ({
          color: v.color.replace("#", "").toUpperCase(),
          colorNameAr: v.colorNameAr,
          colorNameEn: v.colorNameEn,
          size: v.size,
          quantity: v.quantity,
          sku: v.sku,
        })),
        material: formData.materialEn || formData.materialAr
          ? {
            ar: formData.materialAr || formData.materialEn,
            en: formData.materialEn || formData.materialAr,
          }
          : undefined,
        careInstructions: formData.careInstructionsEn || formData.careInstructionsAr
          ? {
            ar: formData.careInstructionsAr || formData.careInstructionsEn,
            en: formData.careInstructionsEn || formData.careInstructionsAr,
          }
          : undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        displayOrder: formData.displayOrder,
      };

      await createProduct(payload).unwrap();

      setModal({
        isOpen: true,
        type: "success",
        message: t("admin.productCreated"),
      });

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
      <div className="space-y-4 sm:space-y-6 max-w-6xl pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Button asChild variant="ghost" size="icon" className="flex-shrink-0">
            <Link href="/admin/dashboard/products">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {t("admin.addProduct")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{t("admin.fillProductDetails")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Info - Same as before */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              {t("admin.basicInfo")}
            </h2>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEn" className="text-sm">
                    {t("admin.productNameEn")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nameEn"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameAr" className="text-sm">
                    {t("admin.productNameAr")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nameAr"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleChange}
                    placeholder="اسم المنتج"
                    required
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn" className="text-sm">
                    {t("admin.productDescriptionEn")} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descriptionEn"
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Product description..."
                    required
                    className="text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionAr" className="text-sm">
                    {t("admin.productDescriptionAr")} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleChange}
                    rows={4}
                    placeholder="وصف المنتج..."
                    required
                    className="text-sm resize-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materialEn" className="text-sm">
                    {t("admin.materialEn")}
                  </Label>
                  <Input
                    id="materialEn"
                    name="materialEn"
                    value={formData.materialEn}
                    onChange={handleChange}
                    placeholder="Cotton, Polyester..."
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materialAr" className="text-sm">
                    {t("admin.materialAr")}
                  </Label>
                  <Input
                    id="materialAr"
                    name="materialAr"
                    value={formData.materialAr}
                    onChange={handleChange}
                    placeholder="قطن، بوليستر..."
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="careInstructionsEn" className="text-sm">
                    {t("admin.careInstructionsEn")}
                  </Label>
                  <Textarea
                    id="careInstructionsEn"
                    name="careInstructionsEn"
                    value={formData.careInstructionsEn}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Wash cold, tumble dry..."
                    className="text-sm resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careInstructionsAr" className="text-sm">
                    {t("admin.careInstructionsAr")}
                  </Label>
                  <Textarea
                    id="careInstructionsAr"
                    name="careInstructionsAr"
                    value={formData.careInstructionsAr}
                    onChange={handleChange}
                    rows={3}
                    placeholder="اغسل على البارد، جفف في المجفف..."
                    className="text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing & Category */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              {t("admin.pricingCategory")}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm">
                  {t("admin.productPrice")} ({t("common.currency")}) <span className="text-red-500">*</span>
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
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compareAtPrice" className="text-sm">
                  {t("admin.compareAtPrice")} ({t("common.currency")})
                </Label>
                <Input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">{t("admin.originalPrice")}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm">
                  {t("admin.productCategory")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId || undefined}
                  onValueChange={(value: string | null) =>
                    setFormData({ ...formData, categoryId: value || "" })
                  }
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={t("admin.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id} className="text-sm">
                        {getLocalizedText(category.name, locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder" className="text-sm">
                  {t("admin.displayOrder")}
                </Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Images with Cloudinary Upload */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              {t("admin.productImages")} <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-gray-500">({images.length}/3)</span>
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <label
                  htmlFor="image-upload"
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-sm ${images.length >= 3 || uploadingImages
                    ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-purple-300 hover:border-purple-500 bg-purple-50 hover:bg-purple-100"
                    }`}
                >
                  {uploadingImages ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                      <span className="text-purple-600 font-medium">
                        {t("admin.uploading")}...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-600 font-medium">
                        {t("admin.uploadImages")}
                      </span>
                    </>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={images.length >= 3 || uploadingImages}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      <Image
                        src={img}
                        alt={`Product ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                          {t("admin.mainImage")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">
                💡 {t("admin.cloudinaryHelp")}
              </p>
            </div>
          </Card>

          {/* Variants - Keep rest of the code same */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                {t("admin.variants")} <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-500">({variants.length})</span>
              </h2>
              <Button type="button" onClick={addVariant} size="sm">
                <Plus className="w-4 h-4 ml-1" />
                {t("admin.addVariant")}
              </Button>
            </div>

            {variants.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                {t("admin.noVariants")}
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">
                        {t("admin.variant")} #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {/* Color */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">{t("admin.color")}</Label>
                        <Select
                          value={variant.color}
                          onValueChange={(value) => updateVariant(variant.id, "color", value)}
                        >
                          <SelectTrigger className="text-xs h-9">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: variant.color }}
                              />
                              <span className="truncate">{variant.colorNameAr}</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {COLORS.map((color) => (
                              <SelectItem key={color.hex} value={color.hex} className="text-xs">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <span>{locale === "ar" ? color.ar : color.en}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Size */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">{t("admin.size")}</Label>
                        <Select
                          value={variant.size}
                          onValueChange={(value) =>
                            updateVariant(variant.id, "size", value)
                          }
                        >
                          <SelectTrigger className="text-xs h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SIZES.map((size) => (
                              <SelectItem key={size} value={size} className="text-xs">
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quantity */}
                      <div className="space-y-1.5">
                        <Label htmlFor={`quantity-${variant.id}`} className="text-xs">
                          {t("admin.quantity")}
                        </Label>
                        <Input
                          id={`quantity-${variant.id}`}
                          type="number"
                          min="0"
                          value={variant.quantity}
                          onChange={(e) =>
                            updateVariant(variant.id, "quantity", parseInt(e.target.value) || 0)
                          }
                          className="text-xs h-9"
                        />
                      </div>

                      {/* SKU - Auto Generated */}
                      <div className="col-span-2 sm:col-span-3 lg:col-span-3 space-y-1.5">
                        <Label className="text-xs flex items-center gap-1">
                          {t("admin.sku")}
                          <span className="text-green-600 text-[10px]">({t("admin.autoGenerated")})</span>
                        </Label>
                        <Input
                          value={variant.sku}
                          readOnly
                          className="text-xs h-9 bg-gray-100 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Status & Settings */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                5
              </span>
              {t("admin.statusSettings")}
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <div className="flex-1">
                  <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                    {t("admin.productActive")}
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">{t("admin.activeDescription")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <div className="flex-1">
                  <Label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">
                    {t("admin.productFeatured")}
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">{t("admin.featuredDescription")}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white p-4 -mx-4 sm:-mx-6 border-t sm:static sm:border-0 sm:bg-transparent sm:p-0">
            <Button
              type="submit"
              disabled={isLoading || uploadingImages}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto shadow-lg"
              size="lg"
            >
              <Save className="w-5 h-5 ml-2" />
              {isLoading ? t("admin.saving") : t("common.save")}
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/admin/dashboard/products">{t("common.cancel")}</Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Success/Error Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        size="sm"
      >
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
            <p className="text-gray-600 text-sm">{modal.message}</p>
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