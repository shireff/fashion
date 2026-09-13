import Link from "next/link";
import { Button } from "./button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  retryLabel?: string;
  homeLabel?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  showHomeButton = true,
  retryLabel = "Try Again",
  homeLabel = "Back to Home",
}: ErrorStateProps) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-4">
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

        {/* Actions */}
        <div className="flex gap-3 justify-center pt-2">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="shadow-sm hover:shadow-md transition-all">
              {retryLabel}
            </Button>
          )}
          {showHomeButton && (
            <Button asChild className="shadow-sm hover:shadow-md transition-all">
              <Link href="/">{homeLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
