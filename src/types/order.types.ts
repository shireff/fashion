import type { Order } from "./order";

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    variantSku: string;
    quantity: number;
  }>;
  shippingAddress: {
    recipientName: string;
    recipientPhone: string;
    governorate: string;
    city: string;
    area?: string;
    streetAddress: string;
    buildingNumber?: string;
    floorNumber?: string;
    apartmentNumber?: string;
    landmark?: string;
  };
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
