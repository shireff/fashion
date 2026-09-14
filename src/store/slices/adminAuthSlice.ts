import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { storage } from "@/lib/utils/storage";

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminUser: User | null;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
  isLoading: true,
  adminUser: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminAuth: (state, action: PayloadAction<{ user: User }>) => {
      if (action.payload.user.role === "admin") {
        state.isAuthenticated = true;
        state.adminUser = action.payload.user;
      }
      state.isLoading = false;
    },
    clearAdminAuth: (state) => {
      state.isAuthenticated = false;
      state.adminUser = null;
      state.isLoading = false;
      // Clear storage when logging out
      if (typeof window !== "undefined") {
        storage.removeItem("token");
        storage.removeItem("adminUser");
      }
    },
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAdminAuth, clearAdminAuth, setAdminLoading } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
