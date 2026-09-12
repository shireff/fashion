"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "./ui/button";

interface LanguageSwitcherProps {
  variant?: "default" | "ghost" | "outline";
  showIcon?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  variant = "ghost",
  showIcon = true,
  className = "",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();

  const switchLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";

    // Set locale cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // Refresh the page to apply new locale
    router.refresh();
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={switchLanguage}
      className={`gap-2 ${className}`}
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      {showIcon && <Languages className="w-4 h-4" />}
      <span className="font-medium">
        {locale === "ar" ? "EN" : "ع"}
      </span>
    </Button>
  );
}
