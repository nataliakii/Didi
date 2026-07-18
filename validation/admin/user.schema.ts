import { USER_ROLES } from "@/constants/order-status";
import { z } from "zod";

export const userAdminCreateSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.enum(USER_ROLES),
  isActive: z.boolean(),
});

export const userAdminUpdateSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  role: z.enum(USER_ROLES),
  isActive: z.boolean(),
  password: z.string().min(8).optional(),
});

export type UserAdminCreateInput = z.infer<typeof userAdminCreateSchema>;
export type UserAdminUpdateInput = z.infer<typeof userAdminUpdateSchema>;
