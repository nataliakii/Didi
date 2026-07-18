import type { UserRole } from "@/constants/order-status";
import { safeConnectDB } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { User } from "@/models/User";
import type {
  UserAdminCreateInput,
  UserAdminUpdateInput,
} from "@/validation/admin/user.schema";
import mongoose from "mongoose";

export type AdminUserSummary = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserAdminError =
  | "not_found"
  | "forbidden"
  | "last_super_admin"
  | "duplicate_email";

function canAssignRole(actorRole: UserRole, targetRole: UserRole): boolean {
  if (actorRole === "super_admin") return true;
  if (actorRole === "admin") {
    return targetRole === "admin" || targetRole === "manager";
  }
  return false;
}

function canModifyUser(
  actorRole: UserRole,
  targetUser: { role: UserRole },
): boolean {
  if (actorRole === "super_admin") return true;
  if (actorRole === "admin") return targetUser.role !== "super_admin";
  return false;
}

async function countActiveSuperAdmins(excludeId?: string): Promise<number> {
  const query: Record<string, unknown> = {
    role: "super_admin",
    isActive: true,
  };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return User.countDocuments(query);
}

function toAdminUserSummary(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AdminUserSummary {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getAdminUsers(): Promise<AdminUserSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ name: 1 })
      .lean();
    return users.map((user) =>
      toAdminUserSummary(
        user as unknown as Parameters<typeof toAdminUserSummary>[0],
      ),
    );
  } catch (error) {
    console.error("getAdminUsers error:", error);
    return [];
  }
}

export async function getAdminUserById(
  id: string,
): Promise<AdminUserSummary | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const user = await User.findById(id).select("-passwordHash").lean();
    if (!user) return null;
    return toAdminUserSummary(
      user as unknown as Parameters<typeof toAdminUserSummary>[0],
    );
  } catch (error) {
    console.error("getAdminUserById error:", error);
    return null;
  }
}

export async function createAdminUser(
  actorRole: UserRole,
  input: UserAdminCreateInput,
): Promise<{ id: string } | { error: UserAdminError }> {
  const db = await safeConnectDB();
  if (!db) return { error: "not_found" };

  if (!canAssignRole(actorRole, input.role)) {
    return { error: "forbidden" };
  }

  try {
    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash,
      role: input.role,
      isActive: input.isActive,
    });
    return { id: user._id.toString() };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return { error: "duplicate_email" };
    }
    console.error("createAdminUser error:", error);
    return { error: "not_found" };
  }
}

export async function updateAdminUser(
  actorRole: UserRole,
  id: string,
  input: UserAdminUpdateInput,
): Promise<{ ok: true } | { error: UserAdminError }> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) {
    return { error: "not_found" };
  }

  try {
    const user = await User.findById(id);
    if (!user) return { error: "not_found" };

    if (!canModifyUser(actorRole, { role: user.role as UserRole })) {
      return { error: "forbidden" };
    }

    if (!canAssignRole(actorRole, input.role)) {
      return { error: "forbidden" };
    }

    const wasActiveSuperAdmin =
      user.role === "super_admin" && user.isActive === true;
    const willBeActiveSuperAdmin =
      input.role === "super_admin" && input.isActive === true;

    if (wasActiveSuperAdmin && !willBeActiveSuperAdmin) {
      const others = await countActiveSuperAdmins(id);
      if (others === 0) {
        return { error: "last_super_admin" };
      }
    }

    user.name = input.name.trim();
    user.email = input.email.trim().toLowerCase();
    user.role = input.role;
    user.isActive = input.isActive;

    if (input.password) {
      user.passwordHash = await hashPassword(input.password);
    }

    await user.save();
    return { ok: true };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return { error: "duplicate_email" };
    }
    console.error("updateAdminUser error:", error);
    return { error: "not_found" };
  }
}
