"use client";

import { ShoppingCart, User, Menu, Home, Package, Info, Mail, LogIn } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CartSheet } from "@/components/cart/CartSheet";
import { siteConfig } from "@/config/site";
import { useState } from "react";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { totalItems } = useAppSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/products", label: t("products"), icon: Package },
    { href: "/about", label: t("about"), icon: Info },
    { href: "/contact", label: t("contact"), icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "right" : "left"} className="w-[280px] sm:w-[320px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  {locale === "ar" ? siteConfig.nameAr : siteConfig.name}
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Menu Actions */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <LanguageSwitcher variant="outline" showIcon={true} className="w-full justify-center" />

                {isAuthenticated ? (
                  <Button asChild variant="outline" className="w-full justify-start gap-3" onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/account">
                      <User className="h-5 w-5" />
                      {t("myAccount")}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full justify-start gap-3" onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/login">
                      <LogIn className="h-5 w-5" />
                      {t("login")}
                    </Link>
                  </Button>
                )}

                <Button asChild variant="outline" className="w-full justify-start gap-3 relative" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {t("cart")}
                    {totalItems > 0 && (
                      <Badge className="absolute left-8 -top-1 h-5 min-w-5 flex items-center justify-center px-1 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {locale === "ar" ? siteConfig.nameAr : siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Switcher - Hidden on mobile */}
            <div className="hidden sm:block">
              <LanguageSwitcher variant="ghost" showIcon={true} />
            </div>

            {isAuthenticated ? (
              <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Link href="/account">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t("myAccount")}</span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}

            {/* Cart Sheet - Desktop only */}
            <div className="hidden sm:block">
              <CartSheet />
            </div>

            {/* Cart Icon - Mobile only */}
            <Button asChild variant="ghost" size="icon" className="relative sm:hidden">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">{t("cart")}</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
