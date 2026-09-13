export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatistics {
  user: User;
  totalOrders: number;
  totalSpent: number;
  addressCount: number;
  recentOrders: {
    _id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  }[];
}

export interface GetUsersParams {
  search?: string;
  role?: "user" | "admin";
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
