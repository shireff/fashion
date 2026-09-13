"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { User, Package, MapPin, LogOut, Mail, Phone } from "lucide-react";

export default function AccountPage() {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const navigationItems = [
    {
      href: "/account",
      icon: User,
      title: t("profile"),
      description: "معلوماتك الشخصية",
    },
    {
      href: "/orders",
      icon: Package,
      title: t("myOrders"),
      description: t("viewOrders"),
    },
    {
      href: "/account/addresses",
      icon: MapPin,
      title: t("addresses"),
      description: t("manageAddresses"),
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
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center gap-2 p-4 transition-all ${isActive
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("profile")}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Name */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{t("name")}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{t("email")}</p>
                    <p className="text-lg font-medium text-gray-900 break-all">{user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{t("phone")}</p>
                    <p className="text-lg font-medium text-gray-900" dir="ltr">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            {/* Orders Card */}
            <Link href="/orders" className="block">
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
            </Link>

            {/* Addresses Card */}
            <Link href="/account/addresses" className="block">
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
            </Link>

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
        </div>
      </div>
    </div>
  );
}
