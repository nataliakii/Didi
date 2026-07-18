import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  deleteAdminDiamond,
  updateAdminDiamond,
} from "@/services/diamond-admin.service";
import { diamondAdminSchema } from "@/validation/admin/diamond.schema";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    const parsed = diamondAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid diamond data." }, { status: 400 });
    }

    const ok = await updateAdminDiamond(id, parsed.data);
    if (!ok) {
      return NextResponse.json({ error: "Diamond not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/admin/diamonds/[id] error:", error);
    return NextResponse.json(
      { error: "Could not update diamond." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const ok = await deleteAdminDiamond(id);
    if (!ok) {
      return NextResponse.json({ error: "Diamond not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/diamonds/[id] error:", error);
    return NextResponse.json(
      { error: "Could not delete diamond." },
      { status: 500 },
    );
  }
}
