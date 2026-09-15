export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const REVIEW_PRODUCT_TYPES = [
  "ring",
  "diamond",
  "jewelry",
  "custom-ring",
  "other",
] as const;
export type ReviewProductType = (typeof REVIEW_PRODUCT_TYPES)[number];
