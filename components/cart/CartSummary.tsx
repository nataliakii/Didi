"use client";

import { Button } from "@/components/ui/Button";
import { getCartItemLineTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";
import { useTranslations } from "next-intl";

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export function CartSummary({ items, subtotal }: CartSummaryProps) {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");

  return (
    <aside className="panel-luxury p-6">
      <h2 className="text-xs font-medium tracking-[0.2em] text-brand-gold uppercase">
        {t("orderSummary")}
      </h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-brand-charcoal/65">{tCommon("subtotal")}</dt>
          <dd className="font-medium text-brand-navy">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-brand-gold/25 pt-3">
          <dt className="font-serif font-medium text-brand-navy">
            {t("estimatedTotal")}
          </dt>
          <dd className="font-serif font-medium text-brand-navy">
            {formatPrice(subtotal)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs leading-relaxed text-brand-charcoal/55">
        {t("taxNote")}
      </p>

      <Button href="/checkout" variant="gold" className="mt-6 w-full">
        {t("proceedToCheckout")}
      </Button>

      <Button href="/products" variant="outline" className="mt-3 w-full">
        {t("continueShopping")}
      </Button>

      {items.length > 0 && (
        <ul className="mt-6 space-y-2 border-t border-brand-gold/20 pt-4 text-xs text-brand-charcoal/55">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span className="truncate">
                {item.name}
                {item.type === "product" && item.quantity > 1
                  ? ` × ${item.quantity}`
                  : ""}
              </span>
              <span className="shrink-0">
                {formatPrice(getCartItemLineTotal(item))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
