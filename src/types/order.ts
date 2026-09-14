import type { Product, ProductVariant } from "./product";
import type { Address } from "./address";
import type { User } from "./user";

export interface OrderItem {
  product: Product | string;
  productId?: string;
  productNameAr?: string;
  productNameEn?: string;
  variant?: ProductVariant | string;
  variantSku?: string;
  color?: string;
  colorNameAr?: string;
  colorNameEn?: string;
  size?: string;
  quantity: number;
  price: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  userId?: User | string; // For backward compatibility
  orderNumber: string;
  items: OrderItem[];
  subtotal?: number;
  totalAmount: number;
  shippingAddress: Address | string;
  shippingCost: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  adminNotes?: string;
  statusHistory?: StatusHistory[];
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}
