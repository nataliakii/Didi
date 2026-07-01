"use client";

import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Select } from "@/components/ui/Select";
import { getPrimaryImageUrl } from "@/lib/cart";
import { formatLabel } from "@/lib/utils";
import type { ProductDetail, ProductVariant } from "@/types";
import { useMemo, useState } from "react";

interface ProductPurchasePanelProps {
  product: ProductDetail;
}

function findMatchingVariant(
  variants: ProductVariant[] | undefined,
  metal?: string,
  ringSize?: string,
): ProductVariant | undefined {
  if (!variants || variants.length === 0) return undefined;

  return variants.find(
    (variant) =>
      (!metal || variant.metal === metal) &&
      (!ringSize || variant.ringSize === ringSize),
  );
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const metalOptions = product.attributes?.metal ?? [];
  const ringSizeOptions = product.attributes?.ringSizes ?? [];

  const requiresMetal = metalOptions.length > 0;
  const requiresRingSize = ringSizeOptions.length > 0;

  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedRingSize, setSelectedRingSize] = useState("");

  const matchedVariant = useMemo(
    () =>
      findMatchingVariant(
        product.variants,
        selectedMetal || undefined,
        selectedRingSize || undefined,
      ),
    [product.variants, selectedMetal, selectedRingSize],
  );

  const price = matchedVariant?.price ?? product.basePrice;
  const salePrice = matchedVariant?.salePrice ?? product.salePrice;

  const missingMetal = requiresMetal && !selectedMetal;
  const missingRingSize = requiresRingSize && !selectedRingSize;
  const canAdd = !missingMetal && !missingRingSize;

  const disabledMessage = missingMetal
    ? "Please select a metal option."
    : missingRingSize
      ? "Please select a ring size."
      : undefined;

  return (
    <div className="space-y-4">
      {requiresMetal && (
        <Select
          id="product-metal"
          label="Metal"
          value={selectedMetal}
          placeholder="Select metal"
          options={metalOptions.map((metal) => ({
            value: metal,
            label: formatLabel(metal),
          }))}
          onChange={setSelectedMetal}
        />
      )}

      {requiresRingSize && (
        <Select
          id="product-ring-size"
          label="Ring Size"
          value={selectedRingSize}
          placeholder="Select ring size"
          options={ringSizeOptions.map((size) => ({
            value: size,
            label: size,
          }))}
          onChange={setSelectedRingSize}
        />
      )}

      <AddToCartButton
        disabled={!canAdd}
        disabledMessage={disabledMessage}
        input={{
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: getPrimaryImageUrl(product.images),
          price,
          salePrice,
          quantity: 1,
          selectedOptions: {
            metal: selectedMetal || undefined,
            ringSize: selectedRingSize || undefined,
            variantId: matchedVariant?.sku,
          },
        }}
      />
    </div>
  );
}
