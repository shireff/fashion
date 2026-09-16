"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { User, Package, MapPin, LogOut } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    // Sync active tab with pathname
    if (pathname === "/account") {
      setActiveTab("profile");
    } else if (pathname === "/account/orders" || pathname.startsWith("/account/orders")) {
      setActiveTab("orders");
    } else if (pathname.startsWith("/account/addresses")) {
      setActiveTab("addresses");
    }
  }, [pathname]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "profile") {
      router.push("/account");
    } else if (tab === "orders") {
      router.push("/account/orders");
    } else if (tab === "addresses") {
      router.push("/account/addresses");
    }
  };

  const navigationItems = [
    {
      id: "profile",
      icon: User,
      title: t("profile"),
    },
    {
      id: "orders",
      icon: Package,
      title: t("myOrders"),
    },
    {
      id: "addresses",
      icon: MapPin,
      title: t("addresses"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{tCommon("account")}</h1>
          <p className="text-gray-600">مرحباً، {user.firstName}!</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="grid grid-cols-3 border-b border-gray-100">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center justify-center gap-2 p-4 transition-all ${isActive
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className={activeTab === "profile" ? "grid lg:grid-cols-3 gap-6" : ""}>
          {/* Main Content */}
          <div className={activeTab === "profile" ? "lg:col-span-2" : ""}>{children}</div>

          {/* Sidebar - Only show on profile tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {/* Orders Card */}
              <button
                onClick={() => handleTabChange("orders")}
                className="w-full block text-right"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="p-6 space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{t("myOrders")}</h3>
                      <p className="text-sm text-gray-600">{t("viewOrders")}</p>
                    </div>
                  </div>
                </div>
              </button>

              {/* Addresses Card */}
              <button
                onClick={() => handleTabChange("addresses")}
                className="w-full block text-right"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="p-6 space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{t("addresses")}</h3>
                      <p className="text-sm text-gray-600">{t("manageAddresses")}</p>
                    </div>
                  </div>
                </div>
              </button>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all py-6"
              >
                <LogOut className="w-5 h-5 ml-2" />
                {tCommon("logout")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
