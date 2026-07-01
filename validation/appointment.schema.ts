import { APPOINTMENT_TYPES } from "@/constants/order-status";
import { METALS } from "@/constants/jewellery";
import { SUPPORTED_LOCALES } from "@/constants/i18n";
import { z } from "zod";

export const appointmentFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(6, "Phone number must be at least 6 characters."),
  appointmentType: z.enum(APPOINTMENT_TYPES, {
    message: "Please select an appointment type.",
  }),
  preferredDate: z
    .string()
    .trim()
    .min(1, "Preferred date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Please enter a valid date.",
    }),
  preferredTime: z.string().trim().min(1, "Preferred time is required."),
  budget: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .max(1000, "Message must be 1000 characters or fewer.")
    .optional(),
  productId: z.string().trim().optional(),
  settingId: z.string().trim().optional(),
  diamondId: z.string().trim().optional(),
  metal: z.enum(METALS).optional(),
  ringSize: z.string().trim().optional(),
  locale: z.enum(SUPPORTED_LOCALES).optional(),
});

export type AppointmentFormInput = z.infer<typeof appointmentFormSchema>;

export function parseAppointmentFormInput(
  data: unknown,
):
  | { success: true; data: AppointmentFormInput }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> } {
  const result = appointmentFormSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    const firstError =
      Object.values(fieldErrors).flat()[0] ?? "Invalid appointment request.";
    return { success: false, error: firstError, fieldErrors };
  }

  return { success: true, data: result.data };
}
