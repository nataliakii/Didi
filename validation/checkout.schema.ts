import { METALS } from "@/constants/jewellery";
import { SUPPORTED_LOCALES } from "@/constants/i18n";
import { z } from "zod";

const productCartItemSchema = z.object({
  type: z.literal("product"),
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(20),
  selectedOptions: z
    .object({
      metal: z.enum(METALS).optional(),
      ringSize: z.string().trim().optional(),
      variantId: z.string().trim().optional(),
    })
    .optional(),
});

const customRingCartItemSchema = z.object({
  type: z.literal("custom-ring"),
  settingId: z.string().trim().min(1),
  diamondId: z.string().trim().min(1),
  selectedMetal: z.enum(METALS),
  ringSize: z.string().trim().min(1),
  quantity: z.literal(1).optional().default(1),
});

export const checkoutRequestSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().trim().email("Please enter a valid email address."),
    phone: z.string().trim().min(6, "Phone number must be at least 6 characters."),
  }),
  shippingAddress: z.object({
    line1: z.string().trim().min(3, "Address is required."),
    line2: z.string().trim().optional(),
    city: z.string().trim().min(2, "City is required."),
    state: z.string().trim().optional(),
    postalCode: z.string().trim().min(2, "Postal code is required."),
    country: z
      .string()
      .trim()
      .length(2, "Use a 2-letter country code (e.g. GR, CY, DE).")
      .transform((value) => value.toUpperCase()),
  }),
  items: z
    .array(z.discriminatedUnion("type", [productCartItemSchema, customRingCartItemSchema]))
    .min(1, "Your bag is empty."),
  shipping: z.object({
    productCode: z.string().trim().min(1, "Please select a shipping method."),
  }),
  locale: z.enum(SUPPORTED_LOCALES).optional(),
});

export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;

export function parseCheckoutRequest(
  data: unknown,
):
  | { success: true; data: CheckoutRequestInput }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> } {
  const result = checkoutRequestSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    const firstError =
      Object.values(fieldErrors).flat()[0] ?? "Invalid checkout request.";
    return { success: false, error: firstError, fieldErrors };
  }

  return { success: true, data: result.data };
}
