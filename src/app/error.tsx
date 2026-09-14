"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");
  const tError = useTranslations("error");
  const router = useRouter();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative bg-white rounded-full p-6 shadow-xl border border-red-100">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            {tError("title")}
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
            {tError("subtitle")}
          </h2>
        </div>

        {/* Description */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-right">
          <p className="text-gray-700 leading-relaxed">
            {tError("description")}
          </p>
          {error.digest && (
            <p className="mt-3 text-sm text-gray-500 font-mono">
              {tError("errorCode")}: {error.digest}
            </p>
          )}

          {/* Error Details Button */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="mt-4 text-sm text-red-600 hover:text-red-700 underline"
          >
            {showDebug ? "إخفاء التفاصيل" : "عرض تفاصيل الخطأ"}
          </button>
        </div>

        {/* Debug Info */}
        {showDebug && (
          <div className="bg-gray-900 text-left rounded-lg p-4 max-h-96 overflow-auto">
            <p className="text-xs text-gray-400 mb-2 font-bold">Error Details:</p>
            <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
              {JSON.stringify(
                {
                  name: error.name,
                  message: error.message,
                  stack: error.stack,
                  digest: error.digest,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={reset}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
            {tError("tryAgain")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="gap-2 hover:bg-gray-50"
          >
            <Home className="w-5 h-5" />
            {tError("backHome")}
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 pt-4">
          {tError("helpText")}
        </p>
      </div>
    </div>
  );
}
