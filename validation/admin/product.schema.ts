import { CERTIFICATION_LABS } from "@/constants/certification";
import {
  AVAILABILITY_STATUSES,
  DIAMOND_SHAPES,
  FANCY_DIAMOND_COLORS,
  GOLD_PURITIES,
  METALS,
  PRODUCT_SHIP_REGIONS,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  RING_STYLES,
  STONE_TYPES,
} from "@/constants/jewellery";
import { z } from "zod";

const productImageSchema = z.object({
  url: z.string().trim().min(1),
  alt: z.string().trim().optional(),
  isPrimary: z.boolean().optional(),
});

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
  productionTime: z.string().trim().optional(),
  /** @deprecated Prefer images[]; kept for backward compatibility */
  imageUrl: z.string().trim().optional(),
  imageAlt: z.string().trim().optional(),
  images: z.array(productImageSchema).optional(),
  videoUrl: z.string().trim().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  attributes: z
    .object({
      metal: z.array(z.enum(METALS)).optional(),
      goldPurity: z.enum(GOLD_PURITIES).optional().nullable(),
      stoneType: z.enum(STONE_TYPES).optional().nullable(),
      isLabGrown: z.boolean().optional(),
      diamondShape: z.enum(DIAMOND_SHAPES).optional().nullable(),
      diamondColor: z.enum(FANCY_DIAMOND_COLORS).optional().nullable(),
      diamondCarat: z.number().min(0).optional().nullable(),
      style: z.enum(RING_STYLES).optional().nullable(),
      ringSizes: z.array(z.string()).optional(),
      customSizeAvailable: z.boolean().optional(),
      customStoneAvailable: z.boolean().optional(),
      shipsTo: z.enum(PRODUCT_SHIP_REGIONS).optional().nullable(),
      certification: z
        .object({
          lab: z.enum(CERTIFICATION_LABS).optional().nullable(),
          reportNumber: z.string().trim().optional().nullable(),
          reportUrl: z.string().trim().optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional(),
});

export type ProductAdminInput = z.infer<typeof productAdminSchema>;
