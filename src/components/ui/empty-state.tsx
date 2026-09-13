import Link from "next/link";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-8 shadow-sm">
          <Icon className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
      
      {description && (
        <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      )}

      {(actionLabel && (actionHref || onAction)) && (
        <div>
          {actionHref ? (
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button onClick={onAction} size="lg" className="shadow-lg hover:shadow-xl transition-all">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
