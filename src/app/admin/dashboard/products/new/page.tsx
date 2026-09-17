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

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        // Calculate new dimensions (max 1200px)
        let width = img.width;
        let height = img.height;
        const maxSize = 1200;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          0.85 // 85% quality
        );
      };
      img.onerror = () => reject(new Error("Image load failed"));
    };
    reader.onerror = () => reject(new Error("File read failed"));
  });
}

async function uploadToCloudinary(file: File): Promise<string> {
  try {
    // Compress image before upload
    const compressedFile = await compressImage(file);

    // Convert file to base64
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!result) {
          reject(new Error("Failed to read file"));
          return;
        }
        resolve(result);
      };
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(compressedFile);
    });

    // Validate base64
    if (!base64.startsWith("data:image/")) {
      throw new Error("Invalid image format");
    }

    // Upload to backend which uploads to Cloudinary
    const token = storage.getItem("token") || "";

    if (!token) {
      throw new Error("Authentication required");
    }

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

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || "Upload failed";
      throw new Error(errorMessage);
    }

    if (!data.success || !data.data?.url) {
      throw new Error("Invalid response from server");
    }

    return data.data.url;
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error(error?.message || "Upload failed");
  }
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

  // Simplified Variants Matrix
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<typeof SIZES[number][]>([]);
  const [variantMatrix, setVariantMatrix] = useState<Record<string, string>>({});

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
      const uploadPromises = filesToUpload.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(`${file.name} is too large (max 50MB)`);
        }

        return uploadToCloudinary(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (error: any) {
      console.error("Upload error:", error);
      setModal({
        isOpen: true,
        type: "error",
        message: error?.message || t("admin.uploadFailed"),
      });
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Toggle color selection
  const toggleColor = (colorHex: string) => {
    if (selectedColors.includes(colorHex)) {
      setSelectedColors(selectedColors.filter((c) => c !== colorHex));
    } else {
      setSelectedColors([...selectedColors, colorHex]);
    }
  };

  // Toggle size selection
  const toggleSize = (size: typeof SIZES[number]) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Generate variants from matrix
  const generateVariantsFromMatrix = () => {
    const newVariants: Variant[] = [];

    selectedColors.forEach((colorHex) => {
      selectedSizes.forEach((size) => {
        const key = `${colorHex}-${size}`;
        const quantity = parseInt(variantMatrix[key] || "0");

        // Only create variant if quantity > 0
        if (quantity > 0) {
          const colorData = COLORS.find((c) => c.hex === colorHex);
          if (colorData) {
            newVariants.push({
              id: `${colorHex}-${size}`,
              color: colorHex,
              colorNameAr: colorData.ar,
              colorNameEn: colorData.en,
              size,
              quantity,
              sku: generateSKU(
                formData.nameEn || "Product",
                colorHex.replace("#", ""),
                size
              ),
            });
          }
        }
      });
    });

    setVariants(newVariants);
  };

  const addVariant = () => {
    // Keep for backward compatibility but not used in new UI
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

          {/* Variants - Simplified Matrix */}
          <Card className="p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                {t("admin.variants")} <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-500">({variants.length} {locale === "ar" ? "متغير" : "variants"})</span>
              </h2>
              <p className="text-xs text-gray-600">
                💡 {locale === "ar" ? "اختر الألوان والمقاسات، ثم أدخل الكمية لكل تركيبة" : "Select colors & sizes, then enter quantity for each combination"}
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-4 space-y-2">
              <Label className="text-sm font-medium">{locale === "ar" ? "اختر الألوان" : "Select Colors"}</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => {
                  const isSelected = selectedColors.includes(color.hex);
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => toggleColor(color.hex)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs transition-all ${isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      <div
                        className="w-5 h-5 rounded border-2 border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-medium">{locale === "ar" ? color.ar : color.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4 space-y-2">
              <Label className="text-sm font-medium">{locale === "ar" ? "اختر المقاسات" : "Select Sizes"}</Label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${isSelected
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variants Matrix */}
            {selectedColors.length > 0 && selectedSizes.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {locale === "ar" ? "الكميات (أدخل 0 لإلغاء المتغير)" : "Quantities (enter 0 to skip variant)"}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateVariantsFromMatrix}
                  >
                    ✓ {locale === "ar" ? "تطبيق" : "Apply"}
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full border rounded-lg">
                    {/* Header */}
                    <div className="bg-gray-50 border-b">
                      <div className="flex">
                        <div className="w-24 sm:w-32 p-2 border-l font-medium text-xs text-gray-600">
                          {locale === "ar" ? "المقاس / اللون" : "Size / Color"}
                        </div>
                        {selectedColors.map((colorHex) => {
                          const color = COLORS.find((c) => c.hex === colorHex)!;
                          return (
                            <div
                              key={colorHex}
                              className="w-20 sm:w-24 p-2 border-l text-center relative group"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  // Remove color from selection
                                  setSelectedColors(selectedColors.filter((c) => c !== colorHex));
                                  // Remove all entries for this color from matrix
                                  const newMatrix = { ...variantMatrix };
                                  selectedSizes.forEach((size) => {
                                    delete newMatrix[`${colorHex}-${size}`];
                                  });
                                  setVariantMatrix(newMatrix);
                                }}
                                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                title={locale === "ar" ? "حذف اللون" : "Remove color"}
                              >
                                ×
                              </button>
                              <div className="flex flex-col items-center gap-1">
                                <div
                                  className="w-6 h-6 rounded border-2 border-gray-300"
                                  style={{ backgroundColor: colorHex }}
                                />
                                <span className="text-[10px] font-medium truncate max-w-full">
                                  {locale === "ar" ? color.ar : color.en}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Body */}
                    <div>
                      {selectedSizes.map((size) => (
                        <div key={size} className="flex border-b last:border-b-0">
                          <div className="w-24 sm:w-32 p-2 border-l font-bold text-sm flex items-center justify-center bg-gray-50 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                // Remove size from selection
                                setSelectedSizes(selectedSizes.filter((s) => s !== size));
                                // Remove all entries for this size from matrix
                                const newMatrix = { ...variantMatrix };
                                selectedColors.forEach((colorHex) => {
                                  delete newMatrix[`${colorHex}-${size}`];
                                });
                                setVariantMatrix(newMatrix);
                              }}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                              title={locale === "ar" ? "حذف المقاس" : "Remove size"}
                            >
                              ×
                            </button>
                            {size}
                          </div>
                          {selectedColors.map((colorHex) => {
                            const key = `${colorHex}-${size}`;
                            return (
                              <div key={key} className="w-20 sm:w-24 p-1.5 border-l">
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={variantMatrix[key] || ""}
                                  onChange={(e) =>
                                    setVariantMatrix({
                                      ...variantMatrix,
                                      [key]: e.target.value,
                                    })
                                  }
                                  className="text-center text-sm h-8 px-1"
                                />
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {variants.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      ✓ {variants.length} {locale === "ar" ? "متغير تم إنشاؤه" : "variants generated"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed rounded-lg">
                {locale === "ar"
                  ? "اختر على الأقل لون واحد ومقاس واحد للبدء"
                  : "Select at least one color and one size to begin"}
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