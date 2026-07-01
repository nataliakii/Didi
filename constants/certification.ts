export const CERTIFICATION_LABS = [
  "GIA",
  "IGI",
  "HRD",
  "GCAL",
  "OTHER",
] as const;

export type CertificationLab = (typeof CERTIFICATION_LABS)[number];

export const CERTIFICATION_LAB_LABELS: Record<CertificationLab, string> = {
  GIA: "Certified by GIA",
  IGI: "Certified by IGI",
  HRD: "Certified by HRD",
  GCAL: "Certified by GCAL",
  OTHER: "Certified",
};
