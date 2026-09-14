"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Grid3x3,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/store/api/authApi";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();
  const { adminUser } = useAppSelector((state) => state.adminAuth);
  const [logout] = useLogoutMutation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize notification permission state directly
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  // Request notification permission on mount
  useEffect(() => {
    // Register service worker for push notifications
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  // Use polling-based notifications (works on Vercel)
  useOrderNotifications({
    enabled: !!adminUser && Notification.permission === "granted",
  });

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        // Show success notification
        new Notification(t("admin.notificationsEnabled"), {
          body: t("admin.notificationsEnabledDesc"),
          icon: "/icons/icon-192x192.png",
        });
      }
    }
  };

  const handleLogout = () => {
    // Clear token from localStorage immediately
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }

    // Try to call logout endpoint in background (fire and forget)
    logout().catch(() => {
      // Silently ignore any logout API errors
    });

    // Redirect to login immediately
    router.push("/admin/login");
  };

  const navItems = [
    {
      href: "/admin/dashboard",
      label: t("admin.overview"),
      icon: LayoutDashboard,
    },
    {
      href: "/admin/dashboard/products",
      label: t("admin.products"),
      icon: Package,
    },
    {
      href: "/admin/dashboard/orders",
      label: t("admin.orders"),
      icon: ShoppingCart,
    },
    {
      href: "/admin/dashboard/categories",
      label: t("admin.categories"),
      icon: Grid3x3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir={isRTL ? "rtl" : "ltr"}>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-50 lg:hidden bg-white shadow-lg ${isRTL ? "right-4" : "left-4"}`}
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-white shadow-lg flex flex-col z-40 transition-transform duration-300 ${isRTL
          ? `right-0 border-l ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`
          : `left-0 border-r ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`
          }`}
      >
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("common.siteName")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{t("admin.dashboard")}</p>
          {adminUser && (
            <p className="text-xs text-gray-500 mt-2">
              {adminUser.firstName} {adminUser.lastName}
            </p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          {/* Language Switcher */}
          <LanguageSwitcher
            variant="outline"
            showIcon={true}
            className="w-full justify-start"
          />

          {/* Notification Permission Button */}
          {notificationPermission !== "granted" && (
            <Button
              onClick={requestNotificationPermission}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <Bell className="w-5 h-5" />
              {t("admin.enableNotifications")}
            </Button>
          )}

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            {t("common.logout")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
