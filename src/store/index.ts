import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import adminAuthReducer from "./slices/adminAuthSlice";
import adminProductsReducer from "./slices/adminProductsSlice";
import adminOrdersReducer from "./slices/adminOrdersSlice";
import adminCategoriesReducer from "./slices/adminCategoriesSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    adminAuth: adminAuthReducer,
    adminProducts: adminProductsReducer,
    adminOrders: adminOrdersReducer,
    adminCategories: adminCategoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks
export { useAppDispatch, useAppSelector } from "./hooks";

// Export API hooks
export * from "./api";

// Export actions
export { setCredentials, logout } from "./slices/authSlice";
export { addItem, updateQuantity, removeItem, clearCart, restoreCart } from "./slices/cartSlice";
export { setAdminAuth, clearAdminAuth, setAdminLoading } from "./slices/adminAuthSlice";

// Export admin products actions (avoid conflicts)
export {
  setSelectedProduct,
  setSearchQuery as setProductSearchQuery,
  setCurrentPage as setProductCurrentPage,
  openProductForm,
  closeProductForm,
  openDeleteModal as openProductDeleteModal,
  closeDeleteModal as closeProductDeleteModal,
} from "./slices/adminProductsSlice";

// Export admin orders actions
export {
  setSelectedOrder,
  setStatusFilter,
  setCurrentPage as setOrderCurrentPage,
  openStatusModal,
  closeStatusModal,
} from "./slices/adminOrdersSlice";

// Export admin categories actions
export {
  openCategoryForm,
  closeCategoryForm,
  openDeleteModal as openCategoryDeleteModal,
  closeDeleteModal as closeCategoryDeleteModal,
} from "./slices/adminCategoriesSlice";
