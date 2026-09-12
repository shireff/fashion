import type { Category } from "./api";

export interface GetCategoriesParams {
  level?: number;
  parentId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
    total: number;
    page: number;
    pageCount: number;
  };
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}
