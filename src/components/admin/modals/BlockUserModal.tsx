"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateUserStatusMutation } from "@/store/api/adminApi";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import type { User } from "@/types/user";

interface BlockUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlockUserModal({ user, isOpen, onClose }: BlockUserModalProps) {
  const t = useTranslations();
  const [updateStatus, { isLoading }] = useUpdateUserStatusMutation();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  if (!user) return null;

  const isBlocking = user.isActive;

  const handleConfirm = async () => {
    setError("");
    setSuccess("");

    try {
      await updateStatus({
        id: user._id,
        isActive: !user.isActive,
      }).unwrap();

      setSuccess(
        isBlocking ? t("admin.users.userBlocked") : t("admin.users.userUnblocked")
      );

      // Close after short delay to show success message
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(t("common.errorOccurred"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {isBlocking ? (
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
            )}
            <DialogTitle>
              {isBlocking ? t("admin.users.blockUser") : t("admin.users.unblockUser")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {isBlocking
              ? t("admin.users.blockConfirmMessage", {
                name: `${user.firstName} ${user.lastName}`,
              })
              : t("admin.users.unblockConfirmMessage", {
                name: `${user.firstName} ${user.lastName}`,
              })}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.users.email")}:</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.users.phone")}:</span>
              <span className="font-medium text-gray-900">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("admin.users.role")}:</span>
              <span className="font-medium text-gray-900">
                {user.role === "admin" ? t("admin.users.admin") : t("admin.users.user")}
              </span>
            </div>
          </div>
        </div>

        {isBlocking && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">
              {t("admin.users.blockWarning")}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-red-700">
              <li>• {t("admin.users.blockEffect1")}</li>
              <li>• {t("admin.users.blockEffect2")}</li>
              <li>• {t("admin.users.blockEffect3")}</li>
            </ul>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant={isBlocking ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            {isBlocking ? t("admin.users.blockConfirm") : t("admin.users.unblockConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
