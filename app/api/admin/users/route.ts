import { USER_MGMT_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { createAdminUser } from "@/services/user-admin.service";
import { userAdminCreateSchema } from "@/validation/admin/user.schema";
import { NextResponse } from "next/server";

function userErrorMessage(error: string): { message: string; status: number } {
  switch (error) {
    case "forbidden":
      return { message: "You cannot assign that role.", status: 403 };
    case "duplicate_email":
      return { message: "Email is already in use.", status: 409 };
    default:
      return { message: "Could not create user.", status: 500 };
  }
}

export async function POST(request: Request) {
  const gate = await requireAdminApi(USER_MGMT_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const body: unknown = await request.json();
    const parsed = userAdminCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid user data." }, { status: 400 });
    }

    const result = await createAdminUser(gate.user.role, parsed.data);
    if ("error" in result) {
      const { message, status } = userErrorMessage(result.error);
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ error: "Could not create user." }, { status: 500 });
  }
}
