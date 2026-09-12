import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "@/types";

interface AdminOrdersState {
  selectedOrder: Order | null;
  statusFilter: string;
  currentPage: number;
  isStatusModalOpen: boolean;
  orderToUpdate: { id: string; currentStatus: string } | null;
}

const initialState: AdminOrdersState = {
  selectedOrder: null,
  statusFilter: "",
  currentPage: 1,
  isStatusModalOpen: false,
  orderToUpdate: null,
};

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    openStatusModal: (
      state,
      action: PayloadAction<{ id: string; currentStatus: string }>
    ) => {
      state.isStatusModalOpen = true;
      state.orderToUpdate = action.payload;
    },
    closeStatusModal: (state) => {
      state.isStatusModalOpen = false;
      state.orderToUpdate = null;
    },
  },
});

export const {
  setSelectedOrder,
  setStatusFilter,
  setCurrentPage,
  openStatusModal,
  closeStatusModal,
} = adminOrdersSlice.actions;

export default adminOrdersSlice.reducer;
