import { auth } from "@/auth";
import { canAccessAdmin, hasRole } from "@/constants/admin-roles";
import type { UserRole } from "@/constants/order-status";
import { NextResponse } from "next/server";

export type AdminSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: UserRole;
};

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  const session = await auth();
  if (!session?.user?.id || !canAccessAdmin(session.user.role)) {
    return null;
  }
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
}

export async function requireAdminApi(
  allowedRoles?: readonly UserRole[],
): Promise<
  | { ok: true; user: AdminSessionUser }
  | { ok: false; response: NextResponse }
> {
  const user = await getAdminSession();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  if (allowedRoles && !hasRole(user.role, allowedRoles)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    };
  }

  return { ok: true, user };
}
