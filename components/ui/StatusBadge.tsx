import { cn, formatLabel } from "@/lib/utils";

type StatusVariant = "default" | "success" | "warning" | "danger" | "info";

interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  default: "bg-brand-cream text-brand-navy",
  success: "bg-brand-navy/10 text-brand-navy",
  warning: "bg-brand-gold-soft/50 text-brand-navy",
  danger: "bg-red-50 text-red-700",
  info: "bg-brand-cream text-brand-navy-light",
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
