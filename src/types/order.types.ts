import type { Order } from "./order";

export interface CreateOrderRequest {
  items: Array<{
    product: string;
    variant?: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  notes?: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    total: number;
    page: number;
    pageCount: number;
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}
