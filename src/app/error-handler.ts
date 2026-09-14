/**
 * Global error handler for production builds
 * Catches and suppresses non-critical React and web-vitals errors
 */

if (typeof window !== "undefined") {
  // Catch unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const errorMsg = event.reason?.message || String(event.reason);
    
    if (
      errorMsg.includes("removeChild") ||
      errorMsg.includes("startTime") ||
      errorMsg.includes("web-vitals") ||
      errorMsg.includes("reportAllChanges")
    ) {
      console.warn("Suppressed non-critical error:", errorMsg);
      event.preventDefault();
    }
  });

  // Catch synchronous errors
  window.addEventListener("error", (event) => {
    if (
      event.message?.includes("removeChild") ||
      event.message?.includes("startTime") ||
      event.message?.includes("web-vitals") ||
      event.message?.includes("reportAllChanges")
    ) {
      console.warn("Suppressed non-critical error:", event.message);
      event.preventDefault();
    }
  });

  // Override console.error for specific patterns
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorString = String(args[0]);
    
    if (
      errorString.includes("removeChild") ||
      errorString.includes("startTime") ||
      errorString.includes("web-vitals") ||
      errorString.includes("reportAllChanges")
    ) {
      // Silently ignore these errors
      return;
    }
    
    originalConsoleError.apply(console, args);
  };
}

export {};
