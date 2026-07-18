import { z } from "zod";

export const shippingRatesRequestSchema = z.object({
  country: z
    .string()
    .trim()
    .length(2, "Use a 2-letter country code (e.g. GR, CY, DE).")
    .transform((value) => value.toUpperCase()),
  city: z.string().trim().min(2, "City is required."),
  postalCode: z.string().trim().min(2, "Postal code is required."),
  itemCount: z.number().int().min(1).max(50).optional(),
});

export type ShippingRatesRequestInput = z.infer<typeof shippingRatesRequestSchema>;

export function parseShippingRatesRequest(
  data: unknown,
):
  | { success: true; data: ShippingRatesRequestInput }
  | { success: false; error: string } {
  const result = shippingRatesRequestSchema.safeParse(data);
  if (!result.success) {
    const first =
      Object.values(result.error.flatten().fieldErrors).flat()[0] ??
      "Invalid shipping request.";
    return { success: false, error: first };
  }
  return { success: true, data: result.data };
}
