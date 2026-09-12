export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BilingualText {
  ar: string;
  en: string;
}

export interface OrderAddress {
  recipientName: string;
  recipientPhone: string;
  governorate: string;
  city: string;
  area: string;
  streetAddress: string;
  buildingNumber?: string;
  floorNumber?: string;
  apartmentNumber?: string;
  landmark?: string;
}

export interface Category {
  _id: string;
  name: BilingualText | string;
  slug: BilingualText | string;
  description?: BilingualText | string;
  image?: string;
  parentId?: string | Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
