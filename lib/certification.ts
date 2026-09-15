import {
  CERTIFICATION_LAB_LABELS,
  type CertificationLab,
} from "@/constants/certification";
import type { DiamondCertification } from "@/types";

export function getCertificationLabLabel(lab: CertificationLab | string): string {
  if (lab in CERTIFICATION_LAB_LABELS) {
    return CERTIFICATION_LAB_LABELS[lab as CertificationLab];
  }
  return `Certified by ${lab}`;
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
  IGI: () => "https://www.igi.org/verify-your-report",
};

export function getOfficialReportHref(
  lab?: CertificationLab | string,
  reportNumber?: string,
): string | undefined {
  if (!lab || !reportNumber?.trim()) return undefined;
  if (!(lab in OFFICIAL_REPORT_CHECK_URLS)) return undefined;

  const builder = OFFICIAL_REPORT_CHECK_URLS[lab as CertificationLab];
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
