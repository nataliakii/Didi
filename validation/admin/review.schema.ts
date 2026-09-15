import { z } from "zod";
import {
  REVIEW_PRODUCT_TYPES,
  REVIEW_STATUSES,
} from "@/constants/reviews";

export const reviewStatusSchema = z.enum(REVIEW_STATUSES);

export const updateReviewStatusSchema = z.object({
  status: reviewStatusSchema,
});

export const createReviewSchema = z.object({
  customerName: z.string().trim().min(1).max(80),
  locale: z.string().trim().max(8).optional(),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(1).max(2000),
  orderId: z.string().trim().optional(),
  customerId: z.string().trim().optional(),
  productType: z.enum(REVIEW_PRODUCT_TYPES).optional(),
  verifiedPurchase: z.boolean().optional(),
});
