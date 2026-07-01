"use client";

import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { useCart } from "@/components/cart/CartProvider";
import { CartSummary } from "@/components/cart/CartSummary";
import { Container } from "@/components/ui/Container";
import { useTranslations } from "next-intl";

export function CartPageContent() {
  const t = useTranslations("cart");
  const { items, isHydrated, getSubtotal } = useCart();

  if (!isHydrated) {
    return (
      <Container className="py-12 lg:py-16">
        <div className="h-64 animate-pulse rounded-sm bg-brand-cream" />
      </Container>
    );
  }

  const subtotal = getSubtotal();

  return (
    <Container className="py-12 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl text-brand-navy sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-brand-charcoal/70">{t("pageDescription")}</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-12">
          <CartEmptyState />
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <section className="card-luxury px-6">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </section>

          <CartSummary items={items} subtotal={subtotal} />
        </div>
      )}
    </Container>
  );
}
