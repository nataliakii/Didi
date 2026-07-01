import { cn } from "@/lib/utils";

interface CompatibilityNoticeProps {
  variant?: "info" | "warning" | "error";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  info: "border-brand-gold/30 bg-brand-cream text-brand-navy",
  warning: "border-brand-gold/50 bg-brand-gold-soft/30 text-brand-navy",
  error: "border-red-200 bg-red-50 text-red-800",
};

export function CompatibilityNotice({
  variant = "info",
  children,
  className,
}: CompatibilityNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-sm border px-4 py-3 text-sm leading-relaxed",
        variantStyles[variant],
        className,
      )}
      role="status"
    >
      {children}
    </div>
  );
}
