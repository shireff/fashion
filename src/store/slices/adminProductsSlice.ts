import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

interface AdminProductsState {
  selectedProduct: Product | null;
  searchQuery: string;
  currentPage: number;
  isFormOpen: boolean;
  isDeleteModalOpen: boolean;
  productToDelete: { id: string; name: string } | null;
}

const initialState: AdminProductsState = {
  selectedProduct: null,
  searchQuery: "",
  currentPage: 1,
  isFormOpen: false,
  isDeleteModalOpen: false,
  productToDelete: null,
};

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    openProductForm: (state, action: PayloadAction<Product | null>) => {
      state.isFormOpen = true;
      state.selectedProduct = action.payload;
    },
    closeProductForm: (state) => {
      state.isFormOpen = false;
      state.selectedProduct = null;
    },
    openDeleteModal: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.isDeleteModalOpen = true;
      state.productToDelete = action.payload;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.productToDelete = null;
    },
  },
});

export const {
  setSelectedProduct,
  setSearchQuery,
  setCurrentPage,
  openProductForm,
  closeProductForm,
  openDeleteModal,
  closeDeleteModal,
} = adminProductsSlice.actions;

export default adminProductsSlice.reducer;
