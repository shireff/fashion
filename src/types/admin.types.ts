import type { Product, Category, Order } from "./index";

// Bilingual text type
export interface BilingualText {
  ar: string;
  en: string;
}

// Product Management
export interface CreateProductRequest {
  name: BilingualText | string;
  description: BilingualText | string;
  price: number;
  categoryId: string;
  images?: string[];
  stock?: number;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  variants?: ProductVariantInput[];
  slug?: BilingualText | string;
  material?: BilingualText | string;
  careInstructions?: BilingualText | string;
  compareAtPrice?: number;
  displayOrder?: number;
}

export interface ProductVariantInput {
  size?: string;
  color?: string;
  colorNameAr?: string;
  colorNameEn?: string;
  quantity: number;
  sku: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

// Category Management
export interface CreateCategoryRequest {
  name: BilingualText | string;
  description?: BilingualText | string;
  slug: BilingualText | string;
  parentId?: string;
  image?: string;
  isActive?: boolean;
  level?: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> { }

// Order Management
export interface UpdateOrderRequest {
  status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  notes?: string;
}

// Statistics
export interface AdminStatistics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  totalCategories: number;
  pendingOrders: number;
  recentOrders: Order[];
  topProducts: Array<{
    product: Product;
    soldCount: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

// Image Upload
export interface UploadImageResponse {
  success: boolean;
  data: {
    url: string;
    publicId: string;
  };
}
