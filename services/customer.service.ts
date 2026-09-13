import { safeConnectDB } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { User } from "@/models/User";
import type {
  CustomerProfileUpdateInput,
  CustomerRegisterInput,
} from "@/validation/customer.schema";
import mongoose from "mongoose";

export type CustomerProfile = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
};

export type CustomerAuthError = "duplicate_email" | "not_found" | "error";

export async function registerCustomer(
  input: CustomerRegisterInput,
): Promise<{ ok: true; id: string } | { ok: false; error: CustomerAuthError }> {
  const db = await safeConnectDB();
  if (!db) return { ok: false, error: "error" };

  try {
    const email = input.email.trim().toLowerCase();
    const existing = await User.findOne({ email }).select("_id").lean();
    if (existing) return { ok: false, error: "duplicate_email" };

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      name: input.name.trim(),
      email,
      phone: input.phone?.trim() || undefined,
      passwordHash,
      role: "customer",
      isActive: true,
    });

    return { ok: true, id: String(user._id) };
  } catch (error) {
    console.error("registerCustomer error:", error);
    return { ok: false, error: "error" };
  }
}

export async function getCustomerProfile(
  userId: string,
): Promise<CustomerProfile | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(userId)) return null;

  try {
    const user = (await User.findById(userId)
      .select("-passwordHash")
      .lean()) as {
      _id: { toString(): string };
      name: string;
      email: string;
      phone?: string;
      role?: string;
      shippingAddress?: CustomerProfile["shippingAddress"];
      createdAt: Date;
    } | null;
    if (!user || user.role !== "customer") return null;

    return {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      shippingAddress: user.shippingAddress,
      createdAt: new Date(user.createdAt).toISOString(),
    };
  } catch (error) {
    console.error("getCustomerProfile error:", error);
    return null;
  }
}

export async function updateCustomerProfile(
  userId: string,
  input: CustomerProfileUpdateInput,
): Promise<{ ok: true } | { ok: false; error: CustomerAuthError }> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false, error: "not_found" };
  }

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "customer") {
      return { ok: false, error: "not_found" };
    }

    user.name = input.name.trim();
    user.phone = input.phone?.trim() || undefined;

    if (input.shippingAddress) {
      const a = input.shippingAddress;
      const hasAny = Boolean(
        a.line1 || a.city || a.postalCode || a.country || a.line2 || a.state,
      );
      user.shippingAddress = hasAny
        ? {
            line1: a.line1 || undefined,
            line2: a.line2 || undefined,
            city: a.city || undefined,
            state: a.state || undefined,
            postalCode: a.postalCode || undefined,
            country: a.country || undefined,
          }
        : undefined;
    }

    await user.save();
    return { ok: true };
  } catch (error) {
    console.error("updateCustomerProfile error:", error);
    return { ok: false, error: "error" };
  }
}
