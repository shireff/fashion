import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function getErrorMessage(error: FetchBaseQueryError | SerializedError, fallback: string): string {
  // Check if it's a FetchBaseQueryError with data
  if ("data" in error && error.data) {
    const apiError = error.data as ApiErrorResponse;

    // Check if it has the standard API error structure
    if (apiError.error?.message) {
      return apiError.error.message;
    }

    // Fallback to any message property
    if (typeof apiError === "object" && "message" in apiError) {
      return String(apiError.message);
    }
  }

  // Check SerializedError message
  if ("message" in error && error.message) {
    return error.message;
  }

  return fallback;
}
