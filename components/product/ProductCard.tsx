"use client";

import { MetalSwatches } from "@/components/product/MetalSwatches";
import { DemoImage } from "@/components/ui/DemoImage";
import { HeartIcon } from "@/components/ui/icons";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  DEMO_PLACEHOLDER_IMAGES,
} from "@/constants/demo-images";
import type { Metal } from "@/constants/jewellery";
import { cn, formatLabel } from "@/lib/utils";
import type { ProductSummary, ProductVariant } from "@/types";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface ProductCardProps {
  product: ProductSummary;
}

function ProductBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "sale";
}) {
  const styles = {
    default: "bg-brand-surface/95 text-brand-text border border-brand-gold/20",
    accent: "bg-brand-navy/90 text-brand-ivory",
    sale: "bg-brand-gold text-brand-text",
  };

  return (
    <span
      className={cn(
        "rounded-sm px-1.5 py-0.5 text-[9px] font-medium tracking-wide sm:px-2 sm:py-1 sm:text-xs",
        styles[variant],
      )}
    >
      {children}
    </span>
  );
}

function findMatchingVariant(
  variants: ProductVariant[] | undefined,
  metal?: Metal,
): ProductVariant | undefined {
  if (!variants?.length || !metal) return undefined;
  return variants.find((variant) => variant.metal === metal);
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const metals = product.attributes?.metal ?? [];
  const [activeMetal, setActiveMetal] = useState<Metal | undefined>(metals[0]);
  const [wishlisted, setWishlisted] = useState(false);

  const matchedVariant = useMemo(
    () => findMatchingVariant(product.variants, activeMetal),
    [product.variants, activeMetal],
  );

  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];
  const primaryUrl = primaryImage?.url?.trim();
  // Catalogue cards show the product photo. Metal swatches change price/label only
  // until we have true per-metal lifestyle shots for each style.
  const displaySrc = primaryUrl ?? matchedVariant?.image;
  const imageFallback = primaryUrl ?? DEMO_PLACEHOLDER_IMAGES.ring;
  const imageAlt =
    primaryImage?.alt?.trim() ||
    `${product.name}${product.attributes?.diamondColor ? ` — ${product.attributes.diamondColor}` : ""} lab-grown diamond jewelry`;

  const displayPrice = matchedVariant?.price ?? product.basePrice;
  const displaySalePrice = matchedVariant?.salePrice ?? product.salePrice;
  const hasSale =
    displaySalePrice !== undefined && displaySalePrice < displayPrice;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden rounded-sm border border-brand-border bg-[#FDFBF7]">
            <DemoImage
              key={`${product._id}-${activeMetal ?? "default"}-${displaySrc ?? "none"}`}
              src={displaySrc}
              fallback={imageFallback}
              alt={imageAlt}
              placeholderKind="ring"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 sm:top-3 sm:left-3 sm:gap-1.5">
              {hasSale && (
                <ProductBadge variant="sale">{tCommon("sale")}</ProductBadge>
              )}
              {product.isFeatured && (
                <ProductBadge variant="accent">{tCommon("featured")}</ProductBadge>
              )}
              {product.isBestSeller && !product.isFeatured && (
                <ProductBadge>{tCommon("bestSeller")}</ProductBadge>
              )}
              {product.isReadyToShip && (
                <ProductBadge>{tCommon("readyToShip")}</ProductBadge>
              )}
            </div>
          </div>
        </Link>
        <button
          type="button"
          aria-label={
            wishlisted ? t("removeFromWishlist") : t("addToWishlist")
          }
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((value) => !value)}
          className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 text-brand-text/50 shadow-sm transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:top-3 sm:right-3 sm:p-2"
        >
          <HeartIcon filled={wishlisted} className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex flex-1 flex-col space-y-1.5 sm:mt-3 sm:space-y-2">
        <div className={cn("min-h-4", metals.length === 0 && "min-h-0")}>
          {metals.length > 0 && (
            <MetalSwatches
              metals={metals}
              activeMetal={activeMetal}
              onSelect={setActiveMetal}
            />
          )}
        </div>
        <Link href={`/products/${product.slug}`} className="block space-y-1">
          <p className="text-[9px] tracking-[0.16em] text-brand-gold uppercase sm:text-[10px] sm:tracking-[0.2em]">
            {formatLabel(product.productType)}
          </p>
          <h3 className="line-clamp-2 font-serif text-sm leading-snug text-brand-text group-hover:text-brand-gold sm:text-base">
            {product.name}
          </h3>
          <p
            className={cn(
              "hidden min-h-[1rem] text-[11px] tracking-wide text-brand-charcoal/50 sm:block",
              !(activeMetal && metals.length > 1) && "invisible",
            )}
          >
            {activeMetal ? formatLabel(activeMetal) : "\u00A0"}
          </p>
          <div className="pt-0.5">
            <PriceDisplay
              price={displayPrice}
              salePrice={displaySalePrice}
              size="xs"
            />
          </div>
        </Link>
      </div>
    </article>
  );
}
