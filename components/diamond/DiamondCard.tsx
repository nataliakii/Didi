"use client";

import { AddDiamondToCartButton } from "@/components/cart/AddDiamondToCartButton";
import { DemoImage } from "@/components/ui/DemoImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getDiamondShapeImage } from "@/constants/demo-images";
import { getPrimaryImageUrl } from "@/lib/cart";
import { formatLabel } from "@/lib/utils";
import type { DiamondSummary } from "@/types";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface DiamondCardProps {
  diamond: DiamondSummary;
}

function isDiamondPurchasable(diamond: DiamondSummary): boolean {
  return diamond.availabilityStatus !== "out-of-stock";
}

export function DiamondCard({ diamond }: DiamondCardProps) {
  const t = useTranslations("diamonds");
  const primaryImage =
    diamond.images.find((img) => img.isPrimary) ?? diamond.images[0];
  const imageAlt =
    primaryImage?.alt ??
    `${diamond.carat.toFixed(2)} ct ${formatLabel(diamond.shape)} diamond`;
  const name = `${diamond.carat.toFixed(2)} ct ${formatLabel(diamond.shape)}`;
  const purchasable = isDiamondPurchasable(diamond);

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-brand-ivory">
        <Link href={`/diamonds/${diamond._id}`} className="absolute inset-0">
          <DemoImage
            src={primaryImage?.url}
            fallback={getDiamondShapeImage(diamond.shape)}
            alt={imageAlt}
            placeholderKind="diamond"
            fill
            className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03] sm:p-6"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>
        {diamond.certification?.lab && (
          <span className="pointer-events-none absolute top-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[9px] font-medium tracking-[0.12em] text-brand-text/80 uppercase shadow-sm">
            {diamond.certification.lab}
          </span>
        )}
        <AddDiamondToCartButton
          variant="icon"
          className="absolute top-2 right-2 z-10"
          disabled={!purchasable}
          disabledMessage={purchasable ? undefined : t("unavailable")}
          input={{
            diamondId: diamond._id,
            name,
            image: getPrimaryImageUrl(diamond.images),
            price: diamond.price,
            salePrice: diamond.salePrice,
            diamondSnapshot: {
              id: diamond._id,
              diamondType: diamond.diamondType,
              shape: diamond.shape,
              carat: diamond.carat,
              cut: diamond.cut,
              color: diamond.color,
              clarity: diamond.clarity,
              price: diamond.price,
              salePrice: diamond.salePrice,
              certification: diamond.certification,
            },
          }}
        />
      </div>

      <Link
        href={`/diamonds/${diamond._id}`}
        className="mt-2 flex flex-1 flex-col px-0.5 sm:mt-3"
      >
        <p className="text-[9px] tracking-[0.16em] text-brand-gold uppercase sm:text-[10px]">
          {formatLabel(diamond.diamondType)} · {formatLabel(diamond.shape)}
        </p>
        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-sm text-brand-text sm:text-base">
            {diamond.carat.toFixed(2)} ct
          </h3>
          <PriceDisplay
            price={diamond.price}
            salePrice={diamond.salePrice}
            size="xs"
          />
        </div>
        <p className="mt-0.5 text-[10px] tracking-wide text-brand-charcoal/50 sm:text-[11px]">
          {diamond.cut} · {diamond.color} · {diamond.clarity}
        </p>
      </Link>
    </article>
  );
}
