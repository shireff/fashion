"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
  const router = useRouter();
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

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">{tCommon("account")}</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
        {/* Profile Info */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold">{t("profile")}</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">{t("name")}</p>
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("email")}</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("phone")}</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <Button asChild variant="outline" className="w-full justify-start h-auto py-4">
            <Link href="/orders">
              <div className="text-left">
                <p className="font-bold">{t("myOrders")}</p>
                <p className="text-sm text-gray-600">{t("viewOrders")}</p>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full justify-start h-auto py-4">
            <Link href="/account/addresses">
              <div className="text-left">
                <p className="font-bold">{t("addresses")}</p>
                <p className="text-sm text-gray-600">{t("manageAddresses")}</p>
              </div>
            </Link>
          </Button>

          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            {tCommon("logout")}
          </Button>
        </div>
      </div>
    </div>
  );
}
