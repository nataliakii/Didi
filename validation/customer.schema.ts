import { z } from "zod";

export const customerRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(6, "Phone number must be at least 6 characters.")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128),
});

export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;

export const customerProfileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  phone: z
    .string()
    .trim()
    .min(6, "Phone number must be at least 6 characters.")
    .optional()
    .or(z.literal("")),
  shippingAddress: z
    .object({
      line1: z.string().trim().min(3).optional().or(z.literal("")),
      line2: z.string().trim().optional().or(z.literal("")),
      city: z.string().trim().min(2).optional().or(z.literal("")),
      state: z.string().trim().optional().or(z.literal("")),
      postalCode: z.string().trim().min(2).optional().or(z.literal("")),
      country: z
        .string()
        .trim()
        .length(2)
        .transform((value) => value.toUpperCase())
        .optional()
        .or(z.literal("")),
    })
    .optional(),
});

export type CustomerProfileUpdateInput = z.infer<
  typeof customerProfileUpdateSchema
>;
