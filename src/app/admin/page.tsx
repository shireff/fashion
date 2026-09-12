"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, adminUser } = useAppSelector((state) => state.adminAuth);

  useEffect(() => {
    // Check if admin is authenticated
    if (isAuthenticated && adminUser) {
      // Redirect to dashboard
      router.replace("/admin/dashboard");
    } else {
      // Redirect to login
      router.replace("/admin/login");
    }
  }, [isAuthenticated, adminUser, router]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-gray-600">جاري التحويل...</p>
      </div>
    </div>
  );
}
