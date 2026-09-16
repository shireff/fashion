import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ShippingCalculationRequest,
  ShippingCalculationResponse,
  ShippingZonesResponse,
} from "@/types";

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingZones: builder.query<ShippingZonesResponse, void>({
      query: () => API_ENDPOINTS.SHIPPING.ZONES,
      providesTags: ["Shipping"],
    }),

    calculateShipping: builder.mutation<ShippingCalculationResponse, ShippingCalculationRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.SHIPPING.CALCULATE,
        method: "POST",
        body: data,
      }),
    }),

    createShippingZone: builder.mutation<any, any>({
      query: (data) => ({
        url: API_ENDPOINTS.SHIPPING.ZONES,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Shipping"],
    }),

    updateShippingZone: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.SHIPPING.ZONES}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Shipping"],
    }),

    deleteShippingZone: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.SHIPPING.ZONES}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shipping"],
    }),
  }),
});

export const {
  useGetShippingZonesQuery,
  useCalculateShippingMutation,
  useCreateShippingZoneMutation,
  useUpdateShippingZoneMutation,
  useDeleteShippingZoneMutation,
} = shippingApi;
