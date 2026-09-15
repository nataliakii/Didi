"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { BagIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { AddDiamondCartInput } from "@/types/cart";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface AddDiamondToCartButtonProps {
  input: AddDiamondCartInput;
  disabled?: boolean;
  disabledMessage?: string;
  className?: string;
  variant?: "full" | "icon";
}

export function AddDiamondToCartButton({
  input,
  disabled = false,
  disabledMessage,
  className,
  variant = "full",
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

  if (variant === "icon") {
    const label = alreadyInBag
      ? t("alreadyInBag")
      : added
        ? t("addedToBag")
        : t("addToBag");

    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        aria-label={label}
        title={disabled ? disabledMessage : label}
        className={cn(
          "rounded-full bg-white/90 p-1.5 text-brand-text shadow-sm transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:opacity-40",
          (added || alreadyInBag) && "text-brand-gold",
          className,
        )}
      >
        <BagIcon className="h-3.5 w-3.5" />
      </button>
    );
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
