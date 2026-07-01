import {
  CERTIFICATION_LAB_LABELS,
  type CertificationLab,
} from "@/constants/certification";
import type { DiamondCertification } from "@/types";

export function getCertificationLabLabel(lab: CertificationLab): string {
  return CERTIFICATION_LAB_LABELS[lab];
}

export function hasGradingReport(
  certification?: DiamondCertification,
): certification is DiamondCertification & {
  lab: CertificationLab;
  reportNumber: string;
} {
  return Boolean(certification?.lab && certification.reportNumber);
}

const OFFICIAL_REPORT_CHECK_URLS: Partial<
  Record<CertificationLab, (reportNumber: string) => string>
> = {
  GIA: (reportNumber) =>
    `https://www.gia.edu/report-check?reportno=${encodeURIComponent(reportNumber)}`,
  IGI: () => "https://www.igi.org/verify-your-report",
  HRD: () => "https://www.hrdantwerp.com/en/verify-a-diamond",
  GCAL: () => "https://www.gcalusa.com/certificate.html",
};

export function getOfficialReportHref(
  lab?: CertificationLab,
  reportNumber?: string,
): string | undefined {
  if (!lab || !reportNumber?.trim()) return undefined;

  const builder = OFFICIAL_REPORT_CHECK_URLS[lab];
  if (!builder) return undefined;

  return builder(reportNumber.trim());
}

export function getReportHrefForCertification(
  certification?: DiamondCertification,
): string | undefined {
  if (!certification) return undefined;

  if (certification.reportUrl?.trim()) {
    return certification.reportUrl.trim();
  }

  if (certification.certificateFileUrl?.trim()) {
    return certification.certificateFileUrl.trim();
  }

  return getOfficialReportHref(certification.lab, certification.reportNumber);
}
