import {
  AVAILABILITY_STATUSES,
  DIAMOND_CLARITY,
  DIAMOND_COLORS,
  DIAMOND_CUTS,
  DIAMOND_SHAPES,
  DIAMOND_TYPES,
} from "@/constants/jewellery";
import { CERTIFICATION_LABS } from "@/constants/certification";
import { z } from "zod";

export const diamondAdminSchema = z.object({
  diamondType: z.enum(DIAMOND_TYPES),
  shape: z.enum(DIAMOND_SHAPES),
  carat: z.number().positive(),
  cut: z.enum(DIAMOND_CUTS),
  color: z.enum(DIAMOND_COLORS),
  clarity: z.enum(DIAMOND_CLARITY),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional().nullable(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES),
  isActive: z.boolean(),
  imageUrl: z.string().trim().optional(),
  videoUrl: z.string().trim().optional(),
  certification: z
    .object({
      lab: z.enum(CERTIFICATION_LABS).optional().nullable(),
      reportNumber: z.string().trim().optional(),
      reportUrl: z.string().trim().optional(),
      certificateFileUrl: z.string().trim().optional(),
    })
    .optional(),
});

export type DiamondAdminInput = z.infer<typeof diamondAdminSchema>;
