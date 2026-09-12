import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  GetProductsParams,
  ProductsResponse,
  ProductResponse,
  CreateReviewRequest,
  Review,
  ReviewsResponse,
} from "@/types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.PRODUCTS.BASE,
        params: params || undefined,
      }),
      providesTags: ["Products"],
    }),

    getProductById: builder.query<ProductResponse, string>({
      query: (id) => API_ENDPOINTS.PRODUCTS.BY_ID(id),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    getProductBySlug: builder.query<ProductResponse, string>({
      query: (slug) => API_ENDPOINTS.PRODUCTS.BY_SLUG(slug),
      providesTags: (result, error, slug) => [{ type: "Products", id: slug }],
    }),

    getProductReviews: builder.query<ReviewsResponse, string>({
      query: (id) => API_ENDPOINTS.PRODUCTS.REVIEWS(id),
    }),

    createReview: builder.mutation<Review, { productId: string; data: CreateReviewRequest }>({
      query: ({ productId, data }) => ({
        url: API_ENDPOINTS.PRODUCTS.REVIEWS(productId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Products", id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
} = productsApi;
