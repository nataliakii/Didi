import {
  DIAMOND_SHAPES,
  METALS,
  PRODUCT_STATUSES,
  RING_STYLES,
} from "@/constants/jewellery";
import { z } from "zod";

export const ringSettingAdminSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  style: z.enum(RING_STYLES),
  basePrice: z.number().min(0),
  description: z.string().trim().optional(),
  availableMetals: z.array(z.enum(METALS)),
  compatibleDiamondShapes: z.array(z.enum(DIAMOND_SHAPES)),
  minRingSize: z.string().trim().min(1),
  maxRingSize: z.string().trim().min(1),
  productionTime: z.string().trim().optional(),
  status: z.enum(PRODUCT_STATUSES),
  isFeatured: z.boolean(),
  imageUrl: z.string().trim().optional(),
  videoUrl: z.string().trim().optional(),
});

export type RingSettingAdminInput = z.infer<typeof ringSettingAdminSchema>;
