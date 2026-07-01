import {
  getCertificationLabLabel,
  getReportHrefForCertification,
} from "@/lib/certification";
import type { DiamondCertification } from "@/types";

interface DiamondGradingReportProps {
  certification?: DiamondCertification;
  className?: string;
}

export function DiamondGradingReport({
  certification,
  className,
}: DiamondGradingReportProps) {
  const reportHref = getReportHrefForCertification(certification);

  if (!certification?.lab && !certification?.reportNumber) {
    return (
      <div className={className}>
        <h2 className="text-sm font-medium text-brand-navy">Official Grading Report</h2>
        <p className="mt-2 text-sm text-brand-charcoal/55">
          Grading report information is not yet available for this diamond.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-sm font-medium text-brand-navy">Official Grading Report</h2>
      <div className="mt-4 rounded-sm border border-brand-gold/20 p-6 text-sm">
        {certification.lab && (
          <p className="font-medium text-brand-navy">
            {getCertificationLabLabel(certification.lab)}
          </p>
        )}
        {certification.reportNumber && (
          <p className="mt-2 text-brand-charcoal/65">
            Report No. {certification.reportNumber}
          </p>
        )}
        <p className="mt-2 text-brand-charcoal/55">Report provided</p>
      </div>

      {reportHref ? (
        <a
          href={reportHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-sm border border-brand-gold/30 px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream/50"
        >
          Check official report
        </a>
      ) : null}
    </div>
  );
}
