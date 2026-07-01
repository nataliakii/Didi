import { formatPrice } from "@/lib/utils";
import type { CustomRingPriceBreakdown } from "@/types";
import { getTranslations } from "next-intl/server";

interface RingPriceSummaryProps {
  breakdown: CustomRingPriceBreakdown;
}

export async function RingPriceSummary({ breakdown }: RingPriceSummaryProps) {
  const t = await getTranslations("ringBuilder");

  return (
    <div className="panel-luxury p-6">
      <h3 className="text-sm font-medium tracking-wide text-brand-navy">
        {t("priceBreakdown")}
      </h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-brand-charcoal/60">{t("settingPrice")}</dt>
          <dd className="font-medium text-brand-navy">
            {formatPrice(breakdown.settingPrice)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-brand-charcoal/60">{t("diamondPrice")}</dt>
          <dd className="font-medium text-brand-navy">
            {formatPrice(breakdown.diamondPrice)}
          </dd>
        </div>
        {breakdown.metalAdjustment > 0 && (
          <div className="flex justify-between">
            <dt className="text-brand-charcoal/60">{t("metalAdjustment")}</dt>
            <dd className="font-medium text-brand-navy">
              {formatPrice(breakdown.metalAdjustment)}
            </dd>
          </div>
        )}
        <div className="flex justify-between border-t border-brand-gold/25 pt-3">
          <dt className="font-serif font-medium text-brand-navy">
            {t("finalPrice")}
          </dt>
          <dd className="font-serif text-lg font-medium text-brand-navy">
            {formatPrice(breakdown.finalPrice)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
