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
    details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the mutation
      const result = await adminLogin(formData);

      // Check if result has error
      if ("error" in result) {
        const errorDetails = JSON.stringify(result.error, null, 2);
        throw new Error(`API Error: ${errorDetails}`);
      }

      // Extract data
      const response = result.data;

      // Validate response structure
      if (!response || !response.success || !response.data) {
        throw new Error(`Invalid response: ${JSON.stringify(response)}`);
      }

      // Save token
      if (response.data.token) {
        storage.setItem("token", response.data.token);
      } else {
        throw new Error("No token in response");
      }

      // Get admin user
      const adminUser = response.data.admin || response.data.user;
      if (adminUser) {
        storage.setItem("adminUser", JSON.stringify(adminUser));
        dispatch(setAdminAuth({ user: adminUser }));
      } else {
        throw new Error("No user data in response");
      }

      // Redirect
      router.push("/admin/dashboard");
    } catch (error: any) {
      // Format error for display
      let errorMessage = t("common.errorMessage");
      let errorDetails = "";

      if (error?.data?.error?.message) {
        errorMessage = error.data.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Capture detailed error info for iPhone debugging
      errorDetails = JSON.stringify(
        {
          type: typeof error,
          constructor: error?.constructor?.name,
          status: error?.status,
          message: error?.message,
          data: error?.data,
        },
        null,
        2
      );

      setErrorModal({
        isOpen: true,
        message: errorMessage,
        details: errorDetails,
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

      {/* Error Modal with Debug Details */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "", details: "" })}
        size="lg"
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t("common.error")}</h3>
              <p className="text-sm text-gray-600">{errorModal.message}</p>
            </div>
          </div>

          {errorModal.details && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-auto">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Debug Info (iPhone):
              </p>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                {errorModal.details}
              </pre>
            </div>
          )}

          <Button
            onClick={() => setErrorModal({ isOpen: false, message: "", details: "" })}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {t("common.close")}
          </Button>
        </div>
      </Modal>
    </>
  );
}
