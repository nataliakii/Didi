import { z } from "zod";

export const categoryAdminSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  parentId: z.string().trim().optional().nullable(),
  isActive: z.boolean(),
});

export type CategoryAdminInput = z.infer<typeof categoryAdminSchema>;
