import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { Modal } from "./modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  variant = "danger",
}: ConfirmationModalProps) {
  const variantStyles = {
    danger: {
      bg: "bg-red-100",
      text: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700",
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-full ${styles.bg} flex items-center justify-center`}>
          <AlertTriangle className={`w-8 h-8 ${styles.text}`} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex gap-3 w-full pt-4">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${styles.button}`}
          >
            {isLoading ? "جاري التنفيذ..." : confirmText}
          </Button>
          <Button onClick={onClose} disabled={isLoading} variant="outline" className="flex-1">
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
