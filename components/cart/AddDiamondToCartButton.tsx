"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import type { AddDiamondCartInput } from "@/types/cart";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AddDiamondToCartButtonProps {
  input: AddDiamondCartInput;
  disabled?: boolean;
  disabledMessage?: string;
  className?: string;
}

export function AddDiamondToCartButton({
  input,
  disabled = false,
  disabledMessage,
  className,
}: AddDiamondToCartButtonProps) {
  const { addDiamondItem } = useCart();
  const t = useTranslations("diamonds");
  const [added, setAdded] = useState(false);
  const [alreadyInBag, setAlreadyInBag] = useState(false);

  function handleAdd() {
    const ok = addDiamondItem(input);
    if (!ok) {
      setAlreadyInBag(true);
      window.setTimeout(() => setAlreadyInBag(false), 4000);
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 4000);
  }

  return (
    <div className={className}>
      <Button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="w-full"
      >
        {t("addToBag")}
      </Button>

      {disabled && disabledMessage && (
        <p className="mt-2 text-center text-sm text-brand-charcoal/55">
          {disabledMessage}
        </p>
      )}

      {alreadyInBag && (
        <p className="mt-2 text-center text-sm text-brand-charcoal/55">
          {t("alreadyInBag")}
        </p>
      )}

      {added && (
        <div className="mt-3 rounded-sm border border-brand-gold/20 bg-brand-cream/50 px-4 py-3 text-sm text-brand-charcoal/75">
          <p>{t("addedToBag")}</p>
          <Link
            href="/cart"
            className="mt-1 inline-block font-medium text-brand-text underline underline-offset-4 hover:text-brand-charcoal/65"
          >
            {t("viewCart")}
          </Link>
        </div>
      )}
    </div>
  );
}
