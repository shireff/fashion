import { baseApi } from "./baseApi";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  GetCategoriesParams,
  CategoriesResponse,
  CategoryResponse,
} from "@/types";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, GetCategoriesParams | void>({
      query: (params) => ({
        url: API_ENDPOINTS.CATEGORIES.BASE,
        params: params || undefined,
      }),
      providesTags: ["Categories"],
    }),

    getCategoryById: builder.query<CategoryResponse, string>({
      query: (id) => API_ENDPOINTS.CATEGORIES.BY_ID(id),
      providesTags: (result, error, id) => [{ type: "Categories", id }],
    }),

    getCategoryBySlug: builder.query<CategoryResponse, string>({
      query: (slug) => API_ENDPOINTS.CATEGORIES.BY_SLUG(slug),
      providesTags: (result, error, slug) => [{ type: "Categories", id: slug }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
} = categoriesApi;
