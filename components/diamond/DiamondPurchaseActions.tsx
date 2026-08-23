"use client";

import { AddDiamondToCartButton } from "@/components/cart/AddDiamondToCartButton";
import { Button } from "@/components/ui/Button";
import { getPrimaryImageUrl } from "@/lib/cart";
import { buildRingSettingHref } from "@/lib/ring-builder";
import { formatLabel } from "@/lib/utils";
import type { DiamondDetail } from "@/types";
import type { Locale } from "@/constants/i18n";
import { useTranslations } from "next-intl";

interface DiamondPurchaseActionsProps {
  diamond: DiamondDetail;
  locale: Locale;
}

export function DiamondPurchaseActions({
  diamond,
  locale,
}: DiamondPurchaseActionsProps) {
  const t = useTranslations("diamonds");
  const purchasable = diamond.availabilityStatus !== "out-of-stock";
  const name = `${diamond.carat.toFixed(2)} ct ${formatLabel(diamond.shape)}`;

  return (
    <div className="mt-8 flex flex-col gap-3">
      <AddDiamondToCartButton
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
      <div className="flex flex-col gap-3 sm:flex-row">
        {purchasable ? (
          <Button
            href={buildRingSettingHref({ diamondId: diamond._id }, locale)}
            variant="secondary"
            className="flex-1"
          >
            {t("setInARing")}
          </Button>
        ) : (
          <Button type="button" variant="secondary" className="flex-1" disabled>
            {t("setInARing")}
          </Button>
        )}
        <Button href="/diamonds" variant="outline" className="flex-1">
          {t("backToDiamonds")}
        </Button>
      </div>
    </div>
  );
}
