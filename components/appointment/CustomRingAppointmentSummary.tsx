"use client";

import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  getCertificationLabLabel,
  getReportHrefForCertification,
} from "@/lib/certification";
import { formatLabel } from "@/lib/utils";
import type { AppointmentContext } from "@/types/appointment";
import type { CertificationLab } from "@/constants/certification";
import { useTranslations } from "next-intl";

interface CustomRingAppointmentSummaryProps {
  customRing: NonNullable<AppointmentContext["customRing"]>;
}

export function CustomRingAppointmentSummary({
  customRing,
}: CustomRingAppointmentSummaryProps) {
  const t = useTranslations("appointment.context");
  const { setting, diamond, selectedMetal, ringSize, estimatedPrice } =
    customRing;

  const reportHref = getReportHrefForCertification(diamond.certification);

  return (
    <div className="panel-luxury p-5">
      <p className="text-xs tracking-[0.2em] text-brand-gold uppercase">
        {t("customRing")}
      </p>
      <h3 className="mt-2 font-serif text-brand-navy">{t("customRingTitle")}</h3>

      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-xs tracking-wide text-brand-charcoal/50 uppercase">
            {t("setting")}
          </dt>
          <dd className="font-medium text-brand-navy">{setting.name}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-brand-charcoal/50 uppercase">
            {t("diamond")}
          </dt>
          <dd className="font-medium text-brand-navy">
            {diamond.carat.toFixed(2)} ct {formatLabel(diamond.shape)}
            {diamond.color && diamond.clarity
              ? ` · ${diamond.color} / ${diamond.clarity}`
              : ""}
            {diamond.cut ? ` · ${diamond.cut}` : ""}
          </dd>
        </div>
        {selectedMetal && (
          <div>
            <dt className="text-xs tracking-wide text-brand-charcoal/50 uppercase">
              {t("metal")}
            </dt>
            <dd className="font-medium text-brand-navy">
              {formatLabel(selectedMetal)}
            </dd>
          </div>
        )}
        {ringSize && (
          <div>
            <dt className="text-xs tracking-wide text-brand-charcoal/50 uppercase">
              {t("ringSize")}
            </dt>
            <dd className="font-medium text-brand-navy">{ringSize}</dd>
          </div>
        )}
        {diamond.certification?.lab && (
          <div>
            <dt className="text-xs tracking-wide text-brand-charcoal/50 uppercase">
              {t("gradingReport")}
            </dt>
            <dd className="text-brand-navy/80">
              {getCertificationLabLabel(diamond.certification.lab as CertificationLab)}
              {diamond.certification.reportNumber
                ? ` · ${t("reportNumber")} ${diamond.certification.reportNumber}`
                : ""}
            </dd>
          </div>
        )}
      </dl>

      {reportHref && (
        <a
          href={reportHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-medium text-brand-gold underline underline-offset-4 hover:text-brand-navy"
        >
          {t("checkOfficialReport")}
        </a>
      )}

      <div className="mt-4 border-t border-brand-gold/25 pt-4">
        <p className="text-xs text-brand-charcoal/55">{t("estimatedPrice")}</p>
        <PriceDisplay price={estimatedPrice} size="sm" className="mt-1" />
      </div>
    </div>
  );
}
