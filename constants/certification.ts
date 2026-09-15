export const CERTIFICATION_LABS = ["IGI"] as const;

export type CertificationLab = (typeof CERTIFICATION_LABS)[number];

export const CERTIFICATION_LAB_LABELS: Record<CertificationLab, string> = {
  IGI: "Certified by IGI",
};
