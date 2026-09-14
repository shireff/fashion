"use client";

import React, { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  translations?: {
    title: string;
    description: string;
    buttonText: string;
  };
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error but suppress certain types
    if (
      error.message?.includes("removeChild") ||
      error.message?.includes("startTime") ||
      error.message?.includes("web-vitals")
    ) {
      console.warn("Suppressed non-critical error:", error.message);
      // Reset state to allow app to continue
      this.setState({ hasError: false });
      return;
    }

    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }

    if (this.state.hasError) {
      const translations = this.props.translations || {
        title: "حدث خطأ غير متوقع",
        description: "نعتذر عن الإزعاج. يرجى تحديث الصفحة أو المحاولة مرة أخرى.",
        buttonText: "تحديث الصفحة",
      };

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {translations.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {translations.description}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full"
            >
              {translations.buttonText}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper with translations support
import { useTranslations } from "next-intl";

export function ErrorBoundaryWithTranslations({ children }: { children: ReactNode }) {
  const t = useTranslations();

  const translations = {
    title: t("error.unexpectedError"),
    description: t("error.unexpectedErrorDescription"),
    buttonText: t("error.reloadPage"),
  };

  return <ErrorBoundary translations={translations}>{children}</ErrorBoundary>;
}
