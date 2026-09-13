import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductVariant } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
  variant?: ProductVariant;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalAmount, totalItems };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        variantId?: string;
      }>
    ) => {
      const { product, quantity, variantId } = action.payload;

      const existingItem = state.items.find(
        (item) => item.product._id === product._id && item.variantId === variantId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const variant = variantId
          ? product.variants?.find(v => v._id === variantId || v.sku === variantId)
          : undefined;

        state.items.push({
          product,
          quantity,
          variantId,
          variant,
        });
      }

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; variantId?: string; quantity: number }>
    ) => {
      const { productId, variantId, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.product._id === productId && i.variantId === variantId
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.product._id === productId && i.variantId === variantId)
          );
        } else {
          item.quantity = quantity;
        }

        const totals = calculateTotals(state.items);
        state.totalAmount = totals.totalAmount;
        state.totalItems = totals.totalItems;

        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify(state.items));
        }
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>
    ) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.product._id === productId && item.variantId === variantId)
      );

      const totals = calculateTotals(state.items);
      state.totalAmount = totals.totalAmount;
      state.totalItems = totals.totalItems;

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;

      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    },
    restoreCart: (state) => {
      if (typeof window !== "undefined") {
        const cartStr = localStorage.getItem("cart");
        if (cartStr) {
          const items = JSON.parse(cartStr) as CartItem[];
          state.items = items;
          const totals = calculateTotals(items);
          state.totalAmount = totals.totalAmount;
          state.totalItems = totals.totalItems;
        }
      }
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  restoreCart,
} = cartSlice.actions;
export default cartSlice.reducer;
