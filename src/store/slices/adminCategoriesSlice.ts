import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/types";

interface AdminCategoriesState {
  selectedCategory: Category | null;
  isFormOpen: boolean;
  isDeleteModalOpen: boolean;
  categoryToDelete: { id: string; name: string } | null;
}

const initialState: AdminCategoriesState = {
  selectedCategory: null,
  isFormOpen: false,
  isDeleteModalOpen: false,
  categoryToDelete: null,
};

const adminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    openCategoryForm: (state, action: PayloadAction<Category | null>) => {
      state.isFormOpen = true;
      state.selectedCategory = action.payload;
    },
    closeCategoryForm: (state) => {
      state.isFormOpen = false;
      state.selectedCategory = null;
    },
    openDeleteModal: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.isDeleteModalOpen = true;
      state.categoryToDelete = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.categoryToDelete = null;
    },
  },
});

export const {
  openCategoryForm,
  closeCategoryForm,
  openDeleteModal,
  closeDeleteModal,
} = adminCategoriesSlice.actions;

export default adminCategoriesSlice.reducer;
