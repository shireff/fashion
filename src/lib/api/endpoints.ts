export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ADMIN_LOGIN: "/auth/admin/login",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    REVIEWS: (id: string) => `/products/${id}/reviews`,
    UPDATE_INVENTORY: (id: string) => `/products/${id}/inventory`,
    ADMIN: {
      LOW_STOCK: "/products/admin/low-stock",
      OUT_OF_STOCK: "/products/admin/out-of-stock",
    },
  },
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
    BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
  },
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    ADMIN: {
      ALL: "/orders/admin/all",
      UPDATE_STATUS: (id: string) => `/orders/admin/${id}/status`,
      UPDATE_NOTES: (id: string) => `/orders/admin/${id}/notes`,
      STATISTICS: "/orders/admin/statistics",
    },
  },
  ADDRESSES: {
    BASE: "/addresses",
    BY_ID: (id: string) => `/addresses/${id}`,
    SET_DEFAULT: (id: string) => `/addresses/${id}/default`,
  },
  SHIPPING: {
    ZONES: "/shipping/zones",
    CALCULATE: "/shipping/calculate",
  },
  CART: {
    BASE: "/cart",
    ITEM: (itemId: string) => `/cart/${itemId}`,
    CLEAR: "/cart/clear",
  },
  UPLOAD: {
    IMAGE: "/upload/image",
  },
  USERS: {
    ADMIN: {
      ALL: "/users/admin/all",
      BY_ID: (id: string) => `/users/admin/${id}`,
      STATISTICS: (id: string) => `/users/admin/${id}/statistics`,
      UPDATE_STATUS: (id: string) => `/users/admin/${id}/status`,
    },
  },
} as const;

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = "cash_on_delivery",
  CREDIT_CARD = "credit_card",
  MOBILE_WALLET = "mobile_wallet",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum AddressLabel {
  HOME = "home",
  WORK = "work",
  OTHER = "other",
}
