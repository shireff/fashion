"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">خطأ</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            {t("errorOccurred")}
          </h2>
        </div>
        
        <p className="text-gray-600">
          {t("errorMessage")}
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset} size="lg">
            {t("tryAgain")}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = "/"}
          >
            {t("backHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
