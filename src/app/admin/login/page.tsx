/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAdminLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setAdminAuth } from "@/store/slices/adminAuthSlice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Shield, AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { storage } from "@/lib/utils/storage";

export default function AdminLoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📝 Starting admin login...");

    try {
      console.log("⏳ Calling adminLogin API...");
      const response = await adminLogin(formData).unwrap();

      console.log("✅ API response received:", {
        success: response.success,
        hasToken: !!response.data?.token,
        hasAdmin: !!response.data?.admin,
        hasUser: !!response.data?.user,
      });

      // Save token using safe storage
      if (response.data?.token) {
        storage.setItem("token", response.data.token);
        console.log("✅ Token saved");
      } else {
        console.error("❌ No token in response");
      }

      // Update Redux state (backend returns 'admin' for admin login)
      const adminUser = response.data?.admin || response.data?.user;
      if (adminUser) {
        // console.log("✅ Admin user found:", {
        //   id: adminUser._id,
        //   email: adminUser.email,
        //   role: adminUser.role,
        // });

        // Save admin user using safe storage
        storage.setItem("adminUser", JSON.stringify(adminUser));
        console.log("✅ Admin user saved to storage");

        dispatch(setAdminAuth({ user: adminUser }));
        console.log("✅ Redux state updated");
      } else {
        console.error("❌ No admin user in response");
      }

      // Redirect to dashboard
      console.log("✅ Redirecting to dashboard");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("❌ Login error:", {
        error,
        status: error?.status,
        data: error?.data,
        message: error?.message,
      });

      // Show detailed error message
      const errorMessage = getErrorMessage(error, t("common.errorMessage"));
      console.error("❌ Error message to show:", errorMessage);

      setErrorModal({
        isOpen: true,
        message: errorMessage,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("admin.login")}
            </h1>
            <p className="text-gray-600 mt-2 text-center text-sm sm:text-base">
              {t("admin.loginSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base font-semibold"
            >
              {isLoading ? t("admin.loggingIn") : t("admin.loginButton")}
            </Button>
          </form>
        </Card>
      </div>

      {/* Error Modal */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        size="sm"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t("common.error")}</h3>
            <p className="text-gray-600">{errorModal.message}</p>
          </div>
          <Button
            onClick={() => setErrorModal({ isOpen: false, message: "" })}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {t("common.close")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
