"use client";

import { DemoImage } from "@/components/ui/DemoImage";
import {
  DEMO_PLACEHOLDER_IMAGES,
} from "@/constants/demo-images";
import { useCart } from "@/components/cart/CartProvider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getCertificationLabLabel } from "@/lib/certification";
import { getCartItemLineTotal, getProductUnitPrice } from "@/lib/cart";
import { buildAppointmentHref, buildRingReviewHref } from "@/lib/ring-builder";
import { formatLabel, formatPrice } from "@/lib/utils";
import type { CertificationLab } from "@/constants/certification";
import type { CartItem } from "@/types/cart";
import type { Locale } from "@/constants/i18n";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

interface CartItemCardProps {
  item: CartItem;
}

function CartItemImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-brand-cream">
      <DemoImage
        src={src}
        fallback={DEMO_PLACEHOLDER_IMAGES.ring}
        alt={alt}
        placeholderKind="ring"
        fill
        className="object-cover"
        sizes="96px"
      />
    </div>
  );
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeItem, updateQuantity } = useCart();
  const locale = useLocale() as Locale;
  const tAppointment = useTranslations("appointment");

  if (item.type === "product") {
    const unitPrice = getProductUnitPrice(item);
    const lineTotal = getCartItemLineTotal(item);

    return (
      <article className="flex gap-4 border-b border-brand-gold/20 py-6 last:border-b-0">
        <CartItemImage src={item.image} alt={item.name} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href={`/products/${item.slug}`}
                className="font-medium text-brand-navy hover:underline"
              >
                {item.name}
              </Link>
              {item.selectedOptions?.metal && (
                <p className="mt-1 text-sm text-brand-charcoal/60">
                  Metal: {formatLabel(item.selectedOptions.metal)}
                </p>
              )}
              {item.selectedOptions?.ringSize && (
                <p className="mt-1 text-sm text-brand-charcoal/60">
                  Ring size: {item.selectedOptions.ringSize}
                </p>
              )}
            </div>
            <PriceDisplay price={lineTotal} size="sm" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor={`qty-${item.id}`} className="sr-only">
                Quantity
              </label>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-gold/30 text-brand-charcoal/75 hover:bg-brand-cream/50 disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span
                id={`qty-${item.id}`}
                className="min-w-8 text-center text-sm font-medium text-brand-navy"
              >
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-brand-gold/30 text-brand-charcoal/75 hover:bg-brand-cream/50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="text-xs text-brand-charcoal/45">
              {formatPrice(unitPrice)} each
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-sm text-brand-charcoal/60 underline underline-offset-4 hover:text-brand-navy"
            >
              Remove
            </button>
          </div>
        </div>
      </article>
    );
  }

  const { settingSnapshot, diamondSnapshot } = item;
  const reviewHref = buildRingReviewHref(
    {
      settingId: item.settingId,
      diamondId: item.diamondId,
      metal: item.selectedMetal as Parameters<typeof buildRingReviewHref>[0]["metal"],
      ringSize: item.ringSize,
    },
    locale,
  );
  const appointmentHref = buildAppointmentHref(
    {
      settingId: item.settingId,
      diamondId: item.diamondId,
      metal: item.selectedMetal as Parameters<typeof buildAppointmentHref>[0]["metal"],
      ringSize: item.ringSize,
    },
    locale,
  );

  return (
    <article className="flex gap-4 border-b border-brand-gold/20 py-6 last:border-b-0">
      <CartItemImage src={item.image} alt={item.name} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-medium text-brand-navy">{item.name}</h3>
            <p className="mt-1 text-sm text-brand-charcoal/60">
              Setting: {settingSnapshot.name}
            </p>
            <p className="mt-1 text-sm text-brand-charcoal/60">
              {diamondSnapshot.carat.toFixed(2)} ct {formatLabel(diamondSnapshot.shape)}
              {diamondSnapshot.color && diamondSnapshot.clarity
                ? ` · ${diamondSnapshot.color} / ${diamondSnapshot.clarity}`
                : ""}
              {diamondSnapshot.cut ? ` · ${diamondSnapshot.cut}` : ""}
            </p>
            <p className="mt-1 text-sm text-brand-charcoal/60">
              Metal: {formatLabel(item.selectedMetal)} · Size: {item.ringSize}
            </p>
            {diamondSnapshot.certification?.lab && (
              <p className="mt-2 text-xs text-brand-charcoal/60">
                {getCertificationLabLabel(
                  diamondSnapshot.certification.lab as CertificationLab,
                )}
                {diamondSnapshot.certification.reportNumber
                  ? ` · Report No. ${diamondSnapshot.certification.reportNumber}`
                  : ""}
              </p>
            )}
          </div>
          <PriceDisplay price={item.price} size="sm" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-xs text-brand-charcoal/45">Qty: 1</p>
          <Link
            href={reviewHref}
            className="text-sm text-brand-charcoal/65 underline underline-offset-4 hover:text-brand-navy"
          >
            Edit ring
          </Link>
          <Link
            href={appointmentHref}
            className="text-sm text-brand-charcoal/65 underline underline-offset-4 hover:text-brand-navy"
          >
            {tAppointment("cartBookRing")}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-sm text-brand-charcoal/60 underline underline-offset-4 hover:text-brand-navy"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
