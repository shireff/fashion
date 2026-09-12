import type { Product, ProductVariant } from "./product";
import type { Address } from "./address";
import type { User } from "./user";

export interface OrderItem {
  product: Product | string;
  variant?: ProductVariant | string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: User | string;
  userId?: User | string; // For backward compatibility
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address | string;
  shippingCost: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
