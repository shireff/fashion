import type { Category, BilingualText } from "./api";

export interface ProductVariant {
  _id?: string;
  size?: string;
  color?: string;
  colorNameAr?: string;
  colorNameEn?: string;
  quantity: number;
  sku: string;
}

export interface Product {
  _id: string;
  name: BilingualText | string;
  description: BilingualText | string;
  slug: BilingualText | string;
  price: number;
  compareAtPrice?: number;
  categoryId: string | Category;
  images: string[];
  variants?: ProductVariant[];
  material?: BilingualText | string;
  careInstructions?: BilingualText | string;
  isActive: boolean;
  isFeatured?: boolean;
  soldCount?: number;
  viewCount?: number;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}
