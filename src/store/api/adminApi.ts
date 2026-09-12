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
      {
        success: boolean;
        data: {
          orders: Order[];
          total: number;
          page: number;
          pageCount: number;
        };
      },
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
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetStatisticsQuery,
} = adminApi;
