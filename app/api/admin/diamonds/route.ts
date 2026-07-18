import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { createAdminDiamond } from "@/services/diamond-admin.service";
import { diamondAdminSchema } from "@/validation/admin/diamond.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const body: unknown = await request.json();
    const parsed = diamondAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid diamond data." }, { status: 400 });
    }

    const id = await createAdminDiamond(parsed.data);
    if (!id) {
      return NextResponse.json(
        { error: "Could not create diamond." },
        { status: 500 },
      );
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/diamonds error:", error);
    return NextResponse.json(
      { error: "Could not create diamond." },
      { status: 500 },
    );
  }
}
