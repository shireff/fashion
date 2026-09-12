import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
    productId: string;
    color?: string;
    size?: string;
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            const existing = state.items.find(
                (entry) =>
                    entry.productId === item.productId &&
                    entry.color === item.color &&
                    entry.size === item.size,
            );

            if (existing) {
                existing.quantity += item.quantity;
            } else {
                state.items.push(item);
            }
        },
        removeItem: (state, action: PayloadAction<Pick<CartItem, "productId" | "color" | "size">>) => {
            state.items = state.items.filter(
                (entry) =>
                    entry.productId !== action.payload.productId ||
                    entry.color !== action.payload.color ||
                    entry.size !== action.payload.size,
            );
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

export const store = configureStore({
    reducer: { cart: cartSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
