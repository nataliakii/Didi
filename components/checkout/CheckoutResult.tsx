"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { useEffect, useRef } from "react";

interface CheckoutResultProps {
  variant: "success" | "failure";
  title: string;
  description: string;
  orderNumber?: string;
  orderLabel: string;
  primaryLabel: string;
  primaryHref: "/" | "/cart" | "/checkout" | "/products" | "/appointment";
  secondaryLabel: string;
  secondaryHref: "/" | "/cart" | "/checkout" | "/products" | "/appointment";
}

export function CheckoutResult({
  variant,
  title,
  description,
  orderNumber,
  orderLabel,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CheckoutResultProps) {
  const { clearCart } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (variant === "success" && !cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [variant, clearCart]);

  return (
    <div className="mx-auto max-w-lg text-center">
      <p className="section-eyebrow">
        {variant === "success" ? "Asteria Diamond House" : "Payment"}
      </p>
      <h1 className="mt-3 font-serif text-3xl text-brand-navy sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 leading-relaxed text-brand-charcoal/70">{description}</p>
      {orderNumber && (
        <p className="mt-6 text-sm text-brand-navy/80">
          {orderLabel}: <span className="font-medium">{orderNumber}</span>
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href={primaryHref} variant="gold">
          {primaryLabel}
        </Button>
        <Button href={secondaryHref} variant="outline">
          {secondaryLabel}
        </Button>
      </div>
    </div>
  );
}
