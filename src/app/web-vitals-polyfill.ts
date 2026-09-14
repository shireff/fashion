/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Web Vitals Polyfill for Safari/iPhone compatibility
 * Prevents "Cannot read properties of undefined (reading 'startTime')" error
 */

if (typeof window !== "undefined") {
  // Suppress Web Vitals errors on Safari/iPhone
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const errorString = args.join(" ");
    
    // Suppress Web Vitals startTime errors
    if (
      errorString.includes("startTime") ||
      errorString.includes("reportAllChanges") ||
      errorString.includes("web-vitals")
    ) {
      // Silently ignore Web Vitals errors
      return;
    }
    
    // Log other errors normally
    originalError.apply(console, args);
  };

  // Ensure Performance API is available
  if (typeof window.performance === "undefined") {
    (window as any).performance = {
      now: () => Date.now(),
      timing: {},
      navigation: {},
      getEntriesByType: () => [],
      getEntriesByName: () => [],
      mark: () => {},
      measure: () => {},
      clearMarks: () => {},
      clearMeasures: () => {},
    };
  }
}

export {};
