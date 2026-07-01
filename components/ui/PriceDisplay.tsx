import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  salePrice?: number;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl font-serif",
};

export function PriceDisplay({
  price,
  salePrice,
  currency = "USD",
  className,
  size = "md",
}: PriceDisplayProps) {
  const hasSale = salePrice !== undefined && salePrice < price;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      {hasSale ? (
        <>
          <span
            className={cn("font-medium text-brand-navy", sizeStyles[size])}
          >
            {formatPrice(salePrice, currency)}
          </span>
          <span className="text-sm text-brand-charcoal/40 line-through">
            {formatPrice(price, currency)}
          </span>
        </>
      ) : (
        <span className={cn("font-medium text-brand-navy", sizeStyles[size])}>
          {formatPrice(price, currency)}
        </span>
      )}
    </div>
  );
}
