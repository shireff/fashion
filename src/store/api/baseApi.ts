import { storage } from "@/lib/utils/storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = storage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        // Get locale from cookie
        const cookies = document.cookie.split("; ");
        const localeCookie = cookies.find((c) => c.startsWith("NEXT_LOCALE="));
        const locale = localeCookie ? localeCookie.split("=")[1] : "ar";

        // Set Accept-Language header for backend localization
        headers.set("Accept-Language", locale === "en" ? "en-US" : "ar-EG");
      }
      return headers;
    },
  }),
  tagTypes: ["Auth", "Products", "Categories", "Orders", "Addresses", "Shipping", "Cart", "Users"],
  endpoints: () => ({}),
});
