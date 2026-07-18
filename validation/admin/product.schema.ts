import {
  AVAILABILITY_STATUSES,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  RING_STYLES,
} from "@/constants/jewellery";
import { z } from "zod";

export const productAdminSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  sku: z.string().trim().min(1),
  productType: z.enum(PRODUCT_TYPES),
  categoryId: z.string().trim().min(1),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  basePrice: z.number().min(0),
  salePrice: z.number().min(0).optional().nullable(),
  stockQuantity: z.number().int().min(0),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES),
  status: z.enum(PRODUCT_STATUSES),
  isFeatured: z.boolean(),
  imageUrl: z.string().trim().optional(),
  videoUrl: z.string().trim().optional(),
  attributes: z
    .object({
      style: z.enum(RING_STYLES).optional().nullable(),
    })
    .optional(),
});

export type ProductAdminInput = z.infer<typeof productAdminSchema>;
