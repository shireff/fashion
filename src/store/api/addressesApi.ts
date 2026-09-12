import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressesResponse,
  AddressResponse,
} from "@/types";

export const addressesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressesResponse, void>({
      query: () => API_ENDPOINTS.ADDRESSES.BASE,
      providesTags: ["Addresses"],
    }),

    getAddressById: builder.query<AddressResponse, string>({
      query: (id) => API_ENDPOINTS.ADDRESSES.BY_ID(id),
      providesTags: (result, error, id) => [{ type: "Addresses", id }],
    }),

    createAddress: builder.mutation<AddressResponse, CreateAddressRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.ADDRESSES.BASE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Addresses"],
    }),

    updateAddress: builder.mutation<AddressResponse, { id: string; data: UpdateAddressRequest }>({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.ADDRESSES.BY_ID(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Addresses", id }, "Addresses"],
    }),

    deleteAddress: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ADDRESSES.BY_ID(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),

    setDefaultAddress: builder.mutation<AddressResponse, string>({
      query: (id) => ({
        url: API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressesApi;
