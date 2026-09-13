import { AlertCircle } from "lucide-react";
import { Modal } from "./modal";
import { Button } from "./button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function ErrorModal({ isOpen, onClose, title, message }: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative bg-red-100 rounded-full p-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>

        {/* Message */}
        <p className="text-gray-600 leading-relaxed">{message}</p>

        {/* Action */}
        <div className="pt-2">
          <Button onClick={onClose} className="w-full shadow-sm hover:shadow-md transition-all">
            حسناً
          </Button>
        </div>
      </div>
    </Modal>
  );
}
