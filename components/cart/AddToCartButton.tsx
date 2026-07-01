"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import type { AddProductCartInput } from "@/types/cart";
import { Link } from "@/i18n/routing";
import { useState } from "react";

interface AddToCartButtonProps {
  input: AddProductCartInput;
  disabled?: boolean;
  disabledMessage?: string;
  className?: string;
}

export function AddToCartButton({
  input,
  disabled = false,
  disabledMessage,
  className,
}: AddToCartButtonProps) {
  const { addProductItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addProductItem(input);
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
        Add to Cart
      </Button>

      {disabled && disabledMessage && (
        <p className="mt-2 text-center text-sm text-brand-charcoal/55">
          {disabledMessage}
        </p>
      )}

      {added && (
        <div className="mt-3 rounded-sm border border-brand-gold/20 bg-brand-cream/50 px-4 py-3 text-sm text-brand-charcoal/75">
          <p>Added to cart</p>
          <Link
            href="/cart"
            className="mt-1 inline-block font-medium text-brand-navy underline underline-offset-4 hover:text-brand-charcoal/65"
          >
            View cart
          </Link>
        </div>
      )}
    </div>
  );
}
