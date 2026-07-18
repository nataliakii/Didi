import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/constants/order-status";
import { z } from "zod";

export const updateOrderAdminSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  trackingNumber: z.string().trim().optional(),
  internalNotes: z.string().trim().optional(),
});

export type UpdateOrderAdminBody = z.infer<typeof updateOrderAdminSchema>;
