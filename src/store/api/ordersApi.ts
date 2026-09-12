import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateOrderRequest,
  GetOrdersParams,
  OrdersResponse,
  OrderResponse,
} from "@/types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponse, CreateOrderRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.ORDERS.BASE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    getOrders: builder.query<OrdersResponse, GetOrdersParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.ORDERS.BASE,
        params: params || undefined,
      }),
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => API_ENDPOINTS.ORDERS.BY_ID(id),
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    cancelOrder: builder.mutation<OrderResponse, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ORDERS.CANCEL(id),
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Orders", id }, "Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} = ordersApi;
