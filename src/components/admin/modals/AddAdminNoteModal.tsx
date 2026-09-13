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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface AddAdminNoteModalProps {
  orderId: string | null;
  orderNumber?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => Promise<void>;
}

export function AddAdminNoteModal({
  orderId,
  orderNumber,
  isOpen,
  onClose,
  onSave,
}: AddAdminNoteModalProps) {
  const t = useTranslations();
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!note.trim()) return;

    setIsSaving(true);
    try {
      await onSave(note.trim());
      setNote("");
      onClose();
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setNote("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("admin.notes.addTitle")}</DialogTitle>
            <DialogDescription>
              {orderNumber && `${t("orders.orderNumber")}: ${orderNumber} - `}
              {t("admin.notes.privateNote")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="note">
              {t("admin.notes.noteLabel")} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("admin.notes.notePlaceholder")}
              rows={5}
              className="mt-1.5"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("admin.notes.noteHint")}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={!note.trim() || isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
