import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ApiResponse,
  PaginatedResponse,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Order,
  UpdateOrderRequest,
} from "@/types";
import type { User, UserStatistics, GetUsersParams } from "@/types/user";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Products Management
    createProduct: builder.mutation<ApiResponse<Product>, CreateProductRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.PRODUCTS.BASE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.PRODUCTS.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        "Products",
      ],
    }),

    deleteProduct: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: API_ENDPOINTS.PRODUCTS.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Low Stock Products
    getLowStockProducts: builder.query<
      ApiResponse<{ products: Product[]; count: number }>,
      { threshold?: number }
    >({
      query: ({ threshold = 10 }) => ({
        url: API_ENDPOINTS.PRODUCTS.ADMIN.LOW_STOCK,
        params: { threshold },
      }),
      providesTags: ["Products"],
    }),

    // Out of Stock Products
    getOutOfStockProducts: builder.query<
      ApiResponse<{ products: Product[]; count: number }>,
      void
    >({
      query: () => API_ENDPOINTS.PRODUCTS.ADMIN.OUT_OF_STOCK,
      providesTags: ["Products"],
    }),

    // Update Inventory
    updateInventory: builder.mutation<
      ApiResponse<Product>,
      { id: string; variantSku: string; quantity: number; reason?: string }
    >({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.PRODUCTS.UPDATE_INVENTORY(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        "Products",
      ],
    }),

    // Categories Management
    createCategory: builder.mutation<ApiResponse<Category>, CreateCategoryRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.CATEGORIES.BASE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation<
      ApiResponse<Category>,
      { id: string; data: UpdateCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.CATEGORIES.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Categories", id },
        "Categories",
      ],
    }),

    deleteCategory: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: API_ENDPOINTS.CATEGORIES.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // Orders Management
    getAllOrders: builder.query<
      ApiResponse<PaginatedResponse<Order> & {
        orders: Order[];
        total: number;
        page: number;
        pageCount: number;
      }>,
      { page?: number; limit?: number; status?: string } | undefined
    >({
      query: (params) => ({
        url: API_ENDPOINTS.ORDERS.ADMIN.ALL,
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.orders
          ? [
            ...result.data.orders.map(({ _id }) => ({ type: "Orders" as const, id: _id })),
            "Orders",
          ]
          : ["Orders"],
    }),

    updateOrderStatus: builder.mutation<
      ApiResponse<Order>,
      { id: string; data: UpdateOrderRequest }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.ORDERS.ADMIN.UPDATE_STATUS(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Orders", id },
        "Orders",
      ],
    }),

    // Update admin notes
    updateAdminNotes: builder.mutation<
      ApiResponse<Order>,
      { id: string; adminNotes: string }
    >({
      query: ({ id, adminNotes }) => ({
        url: API_ENDPOINTS.ORDERS.ADMIN.UPDATE_NOTES(id),
        method: "PATCH",
        body: { adminNotes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Orders", id },
        "Orders",
      ],
    }),

    // Statistics
    getStatistics: builder.query<
      ApiResponse<{
        totalOrders: number;
        totalRevenue: number;
        totalProducts: number;
        totalUsers: number;
        recentOrders: Order[];
      }>,
      void
    >({
      query: () => API_ENDPOINTS.ORDERS.ADMIN.STATISTICS,
      providesTags: ["Orders", "Products"],
    }),

    // Users Management
    getAllUsers: builder.query<
      ApiResponse<PaginatedResponse<User> & {
        users: User[];
        total: number;
        page: number;
        pageCount: number;
      }>,
      GetUsersParams | undefined
    >({
      query: (params) => ({
        url: API_ENDPOINTS.USERS.ADMIN.ALL,
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.users
          ? [
            ...result.data.users.map(({ _id }) => ({ type: "Users" as const, id: _id })),
            "Users",
          ]
          : ["Users"],
    }),

    getUserById: builder.query<ApiResponse<{ user: User }>, string>({
      query: (id) => API_ENDPOINTS.USERS.ADMIN.BY_ID(id),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    getUserStatistics: builder.query<ApiResponse<UserStatistics>, string>({
      query: (id) => API_ENDPOINTS.USERS.ADMIN.STATISTICS(id),
      providesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Orders", id: `user-${id}` },
      ],
    }),

    updateUserStatus: builder.mutation<
      ApiResponse<{ user: User }>,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: API_ENDPOINTS.USERS.ADMIN.UPDATE_STATUS(id),
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        "Users",
      ],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetLowStockProductsQuery,
  useGetOutOfStockProductsQuery,
  useUpdateInventoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateAdminNotesMutation,
  useGetStatisticsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserStatisticsQuery,
  useUpdateUserStatusMutation,
} = adminApi;
