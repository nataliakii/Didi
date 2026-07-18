import { USER_MGMT_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { updateAdminUser } from "@/services/user-admin.service";
import { userAdminUpdateSchema } from "@/validation/admin/user.schema";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function userErrorMessage(error: string): { message: string; status: number } {
  switch (error) {
    case "not_found":
      return { message: "User not found.", status: 404 };
    case "forbidden":
      return { message: "You cannot modify this user.", status: 403 };
    case "last_super_admin":
      return {
        message: "Cannot deactivate or demote the last active super admin.",
        status: 409,
      };
    case "duplicate_email":
      return { message: "Email is already in use.", status: 409 };
    default:
      return { message: "Could not update user.", status: 500 };
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const gate = await requireAdminApi(USER_MGMT_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    const parsed = userAdminUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid user data." }, { status: 400 });
    }

    const result = await updateAdminUser(gate.user.role, id, parsed.data);
    if ("error" in result) {
      const { message, status } = userErrorMessage(result.error);
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/admin/users/[id] error:", error);
    return NextResponse.json({ error: "Could not update user." }, { status: 500 });
  }
}
