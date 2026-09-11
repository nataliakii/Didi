import type { UserRole } from "@/constants/order-status";

export const OPS_ROLES: UserRole[] = ["manager", "admin", "super_admin"];
export const CATALOG_ROLES: UserRole[] = ["admin", "super_admin"];
export const USER_MGMT_ROLES: UserRole[] = ["admin", "super_admin"];
/** Site analytics and other super-admin-only tools. */
export const SUPER_ADMIN_ROLES: UserRole[] = ["super_admin"];

export function hasRole(
  role: string | undefined,
  allowed: readonly UserRole[],
): boolean {
  return Boolean(role && allowed.includes(role as UserRole));
}

export function canAccessAdmin(role: string | undefined): boolean {
  return hasRole(role, OPS_ROLES);
}

export function isSuperAdmin(role: string | undefined): boolean {
  return hasRole(role, SUPER_ADMIN_ROLES);
}
