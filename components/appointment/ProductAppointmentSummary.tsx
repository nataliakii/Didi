"use client";

import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getPrimaryImageUrl } from "@/lib/cart";
import type { AppointmentProductSnapshot } from "@/types/appointment";
import { DemoImage } from "@/components/ui/DemoImage";
import { DEMO_PLACEHOLDER_IMAGES } from "@/constants/demo-images";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface ProductAppointmentSummaryProps {
  product: AppointmentProductSnapshot;
}

export function ProductAppointmentSummary({
  product,
}: ProductAppointmentSummaryProps) {
  const t = useTranslations("appointment.context");
  const image = product.image ?? getPrimaryImageUrl([]);

  return (
    <div className="panel-luxury p-5">
      <p className="text-xs tracking-[0.2em] text-brand-gold uppercase">
        {t("appointmentAbout")}
      </p>
      <p className="mt-2 text-sm text-brand-charcoal/65">{t("bookingAbout")}</p>
      <div className="mt-4 flex gap-4">
        {image ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-brand-cream">
            <DemoImage
              src={image}
              alt={product.name}
              fallback={DEMO_PLACEHOLDER_IMAGES.ring}
              placeholderKind="ring"
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        ) : null}
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-brand-navy hover:text-brand-gold"
          >
            {product.name}
          </Link>
          <PriceDisplay
            price={product.basePrice}
            salePrice={product.salePrice}
            size="sm"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
