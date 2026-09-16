"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new account orders page
    router.replace("/account/orders");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التحويل...</p>
      </div>
    </div>
  );
}
