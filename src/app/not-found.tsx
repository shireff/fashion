"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Animation */}
        <div className="relative">
          <h1 className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-purple-600 to-pink-600 -z-10" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("errors.pageNotFound")}
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {t("errors.pageNotFoundDescription")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Link href="/">
              <Home className="w-5 h-5" />
              {t("common.backToHome")}
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/products">
              <ShoppingBag className="w-5 h-5" />
              {t("common.browseProducts")}
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t">
          <p className="text-sm text-gray-500 mb-4">{t("errors.maybeYouLookingFor")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
              {t("common.products")}
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/categories" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
              {t("common.categories")}
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/account/orders" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
              {t("common.myOrders")}
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/account/addresses" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
              {t("common.myAddresses")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
