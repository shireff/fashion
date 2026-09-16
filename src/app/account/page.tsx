"use client";

import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store";
import { User, Mail, Phone } from "lucide-react";

export default function AccountPage() {
  const t = useTranslations("account");
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          {t("profile")}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Name */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{t("name")}</p>
            <p className="text-lg font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{t("email")}</p>
            <p className="text-lg font-medium text-gray-900 break-all">{user.email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{t("phone")}</p>
            <p className="text-lg font-medium text-gray-900" dir="ltr">{user.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
