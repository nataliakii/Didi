import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/constants/order-status";
import { z } from "zod";

const optionalDateInput = z
  .union([z.string().trim(), z.null()])
  .optional()
  .transform((value, ctx) => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;
    const date = new Date(`${value}T12:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid date (YYYY-MM-DD).",
      });
      return z.NEVER;
    }
    return date;
  });

export const updateOrderAdminSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  trackingNumber: z.string().trim().optional(),
  internalNotes: z.string().trim().optional(),
  promisedDeliveryDate: optionalDateInput,
  productionEta: optionalDateInput,
  timelineNotes: z.union([z.string().trim(), z.null()]).optional(),
  notifyCustomer: z.boolean().optional(),
  customerMessage: z.string().trim().max(500).optional(),
});

export type UpdateOrderAdminBody = z.infer<typeof updateOrderAdminSchema>;
