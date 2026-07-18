import type { UserRole } from "@/constants/order-status";

export const OPS_ROLES: UserRole[] = ["manager", "admin", "super_admin"];
export const CATALOG_ROLES: UserRole[] = ["admin", "super_admin"];
export const USER_MGMT_ROLES: UserRole[] = ["admin", "super_admin"];

export function hasRole(
  role: string | undefined,
  allowed: readonly UserRole[],
): boolean {
  return Boolean(role && allowed.includes(role as UserRole));
}

export function canAccessAdmin(role: string | undefined): boolean {
  return hasRole(role, OPS_ROLES);
}
