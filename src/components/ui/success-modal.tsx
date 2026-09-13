"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  title?: string;
  message?: string;
  redirectUrl?: string;
  autoRedirect?: boolean;
  autoRedirectDelay?: number;
}

export function SuccessModal({
  isOpen,
  onClose,
  orderNumber,
  title,
  message,
  redirectUrl = "/orders",
  autoRedirect = true,
  autoRedirectDelay = 4000,
}: SuccessModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  useEffect(() => {
    if (isOpen && autoRedirect) {
      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, autoRedirectDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoRedirect, autoRedirectDelay, router, redirectUrl]);

  const defaultTitle = isRTL ? "تم إنشاء طلبك بنجاح! 🎉" : "Order Created Successfully! 🎉";
  const defaultMessage = isRTL
    ? "شكراً لك! سيتم التواصل معك قريباً لتأكيد طلبك وترتيب التوصيل."
    : "Thank you! We will contact you soon to confirm your order and arrange delivery.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 leading-tight px-4">
            {title || defaultTitle}
          </h3>

          {/* Order Number Badge */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-3 rounded-xl border-2 border-purple-200">
            <p className="text-sm text-gray-600 mb-1">
              {isRTL ? "رقم الطلب" : "Order Number"}
            </p>
            <p className="text-lg font-mono font-bold text-purple-700">
              {orderNumber}
            </p>
          </div>

          {/* Message */}
          <p className="text-gray-600 leading-relaxed px-4 text-base">
            {message || defaultMessage}
          </p>

          {/* Info Cards */}
          <div className="w-full grid grid-cols-2 gap-3 mt-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {isRTL ? "سنتصل بك" : "We'll call you"}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
              <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                {isRTL ? "توصيل سريع" : "Fast delivery"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
            <Button
              onClick={() => router.push(redirectUrl)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
              size="lg"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {isRTL ? "عرض طلباتي" : "View My Orders"}
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1 border-2"
              size="lg"
            >
              {isRTL ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </div>

          {/* Auto-redirect notice */}
          {autoRedirect && (
            <p className="text-xs text-gray-400 mt-2">
              {isRTL
                ? `سيتم التحويل تلقائياً خلال ${autoRedirectDelay / 1000} ثوانٍ...`
                : `Redirecting in ${autoRedirectDelay / 1000} seconds...`}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
