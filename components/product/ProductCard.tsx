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
    default: "bg-white/95 text-brand-navy border border-brand-gold/20",
    accent: "bg-brand-navy/90 text-brand-ivory",
    sale: "bg-brand-gold text-brand-navy",
  };

  return (
    <span
      className={cn(
        "rounded-sm px-2 py-1 text-xs font-medium tracking-wide",
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
  const displaySrc = matchedVariant?.image ?? primaryImage?.url;
  const imageFallback = primaryImage?.url ?? DEMO_PLACEHOLDER_IMAGES.ring;
  const imageAlt = primaryImage?.alt ?? product.name;

  const displayPrice = matchedVariant?.price ?? product.basePrice;
  const displaySalePrice = matchedVariant?.salePrice ?? product.salePrice;
  const hasSale =
    displaySalePrice !== undefined && displaySalePrice < displayPrice;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="card-luxury relative aspect-square overflow-hidden bg-brand-cream">
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
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
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
          className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-brand-navy/50 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          <HeartIcon filled={wishlisted} className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col space-y-2">
        <div className={cn("min-h-5", metals.length === 0 && "min-h-0")}>
          {metals.length > 0 && (
            <MetalSwatches
              metals={metals}
              activeMetal={activeMetal}
              onSelect={setActiveMetal}
            />
          )}
        </div>
        <Link href={`/products/${product.slug}`} className="block space-y-1">
          <p className="text-[10px] tracking-[0.2em] text-brand-gold uppercase">
            {formatLabel(product.productType)}
          </p>
          <h3 className="line-clamp-2 min-h-[2.5rem] font-serif text-base leading-snug text-brand-navy group-hover:text-brand-gold">
            {product.name}
          </h3>
          <p
            className={cn(
              "min-h-[1rem] text-[11px] tracking-wide text-brand-charcoal/50",
              !(activeMetal && metals.length > 1) && "invisible",
            )}
          >
            {activeMetal ? formatLabel(activeMetal) : "\u00A0"}
          </p>
          <div className="min-h-[1.5rem] pt-0.5">
            <PriceDisplay
              price={displayPrice}
              salePrice={displaySalePrice}
              size="sm"
            />
          </div>
        </Link>
      </div>
    </article>
  );
}
