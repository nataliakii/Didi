import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  getCertificationLabLabel,
  getReportHrefForCertification,
} from "@/lib/certification";
import { formatLabel } from "@/lib/utils";
import type { DiamondSummary } from "@/types";

interface SelectedDiamondSummaryProps {
  diamond: DiamondSummary;
}

export function SelectedDiamondSummary({ diamond }: SelectedDiamondSummaryProps) {
  const reportHref = getReportHrefForCertification(diamond.certification);

  return (
    <div className="panel-luxury p-4">
      <p className="text-xs tracking-[0.2em] text-brand-gold uppercase">
        Selected Diamond
      </p>
      <div className="mt-3">
        <h3 className="font-serif text-brand-navy">
          {diamond.carat.toFixed(2)} ct {formatLabel(diamond.shape)}
        </h3>
        <p className="text-sm text-brand-charcoal/60">
          {formatLabel(diamond.diamondType)} &middot; {diamond.color} /{" "}
          {diamond.clarity} / {diamond.cut}
        </p>
        <PriceDisplay
          price={diamond.price}
          salePrice={diamond.salePrice}
          size="sm"
          className="mt-1"
        />

        {diamond.certification?.lab && (
          <p className="mt-3 text-sm text-brand-navy/80">
            {getCertificationLabLabel(diamond.certification.lab)}
          </p>
        )}
        {diamond.certification?.reportNumber && (
          <p className="mt-1 text-sm text-brand-charcoal/65">
            Report No. {diamond.certification.reportNumber}
          </p>
        )}
        {reportHref && (
          <a
            href={reportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-brand-gold underline underline-offset-4 hover:text-brand-navy"
          >
            Check official report
          </a>
        )}
      </div>
    </div>
  );
}
