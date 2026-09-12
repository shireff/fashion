"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setAdminAuth, clearAdminAuth } from "@/store";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, adminUser } = useAppSelector((state) => state.adminAuth);

  useEffect(() => {
    const checkAuth = async () => {
      // Check localStorage for token and admin user
      const token = localStorage.getItem("token");
      const storedAdminUser = localStorage.getItem("adminUser");

      if (token && storedAdminUser) {
        try {
          const parsedUser = JSON.parse(storedAdminUser);

          // Restore admin state if not already authenticated
          if (!isAuthenticated || !adminUser) {
            dispatch(setAdminAuth({ user: parsedUser }));
          }

          // If on login page and authenticated, redirect to dashboard
          if (pathname === "/admin/login") {
            router.replace("/admin/dashboard");
          }
        } catch (error) {
          // Invalid stored data, clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("adminUser");
          dispatch(clearAdminAuth());

          // Redirect to login if not already there
          if (pathname !== "/admin/login") {
            router.replace("/admin/login");
          }
        }
      } else {
        // No token or user, clear state
        dispatch(clearAdminAuth());

        // Redirect to login if not already there
        if (pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, dispatch, router, isAuthenticated, adminUser]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show dashboard/admin pages only if authenticated
  if (isAuthenticated && adminUser) {
    return <>{children}</>;
  }

  // Fallback: show nothing (will redirect)
  return null;
}
