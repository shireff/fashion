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
  }),
});

export const {
  useGetShippingZonesQuery,
  useCalculateShippingMutation,
} = shippingApi;
