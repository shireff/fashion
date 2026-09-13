"use client";

import { useEffect } from "react";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add manifest and meta tags dynamically for PWA
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "/manifest.json";
    document.head.appendChild(manifest);

    const themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    themeColor.content = "#9333ea";
    document.head.appendChild(themeColor);

    const appleCapable = document.createElement("meta");
    appleCapable.name = "apple-mobile-web-app-capable";
    appleCapable.content = "yes";
    document.head.appendChild(appleCapable);

    // Register Service Worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration.scope);
          registration.update();
        })
        .catch((error) => {
          console.error("❌ SW registration failed:", error);
        });
    }

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).deferredPrompt = e;
      console.log("💡 PWA install prompt available - check browser menu");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      if (manifest.parentNode) document.head.removeChild(manifest);
      if (themeColor.parentNode) document.head.removeChild(themeColor);
      if (appleCapable.parentNode) document.head.removeChild(appleCapable);
    };
  }, []);

  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
