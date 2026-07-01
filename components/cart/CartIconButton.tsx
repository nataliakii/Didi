"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CartIconButtonProps {
  className?: string;
  onNavigate?: () => void;
}

export function CartIconButton({ className, onNavigate }: CartIconButtonProps) {
  const t = useTranslations("navigation");
  const { getItemCount, isHydrated } = useCart();
  const count = isHydrated ? getItemCount() : 0;

  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      className={cn(
        "relative inline-flex items-center text-sm text-brand-navy/70 transition-colors hover:text-brand-navy",
        className,
      )}
      aria-label={count > 0 ? t("cartWithCount", { count }) : t("cart")}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-medium text-brand-navy">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
