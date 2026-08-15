import { cn, formatLabel } from "@/lib/utils";

type StatusVariant = "default" | "success" | "warning" | "danger" | "info";

interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  default: "bg-brand-surface text-brand-muted border border-brand-border",
  success: "bg-brand-teal/15 text-brand-teal-soft border border-brand-teal/30",
  warning: "bg-brand-gold/15 text-brand-gold-soft border border-brand-gold/30",
  danger:
    "bg-brand-crimson/20 text-brand-crimson-soft border border-brand-crimson/35",
  info: "bg-brand-surface-hover text-brand-muted border border-brand-border",
};

const statusVariantMap: Record<string, StatusVariant> = {
  new: "info",
  paid: "success",
  in_production: "warning",
  ready_for_pickup: "info",
  shipped: "info",
  completed: "success",
  cancelled: "danger",
  refunded: "default",
  pending: "warning",
  created: "success",
  skipped: "default",
  failed: "danger",
  partially_refunded: "warning",
  requested: "warning",
  confirmed: "success",
  rescheduled: "info",
  draft: "default",
  published: "success",
  archived: "default",
  "in-stock": "success",
  "made-to-order": "warning",
  "out-of-stock": "danger",
  "pre-order": "info",
};

export function StatusBadge({
  status,
  label,
  variant,
  className,
}: StatusBadgeProps) {
  const resolvedVariant = variant ?? statusVariantMap[status] ?? "default";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide capitalize",
        variantStyles[resolvedVariant],
        className,
      )}
    >
      {label ?? formatLabel(status)}
    </span>
  );
}
