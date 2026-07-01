import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-sm border border-dashed border-brand-gold/30 bg-brand-cream/50 px-6 py-12 text-center",
        className,
      )}
    >
      <h3 className="font-serif text-lg text-brand-navy">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-brand-charcoal/70">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
