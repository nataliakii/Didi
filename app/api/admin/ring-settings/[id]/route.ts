import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  deleteAdminRingSetting,
  updateAdminRingSetting,
} from "@/services/ring-setting-admin.service";
import { ringSettingAdminSchema } from "@/validation/admin/ring-setting.schema";
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
    const parsed = ringSettingAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid ring setting data." },
        { status: 400 },
      );
    }

    const ok = await updateAdminRingSetting(id, parsed.data);
    if (!ok) {
      return NextResponse.json(
        { error: "Ring setting not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/admin/ring-settings/[id] error:", error);
    return NextResponse.json(
      { error: "Could not update ring setting." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const ok = await deleteAdminRingSetting(id);
    if (!ok) {
      return NextResponse.json(
        { error: "Ring setting not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/ring-settings/[id] error:", error);
    return NextResponse.json(
      { error: "Could not delete ring setting." },
      { status: 500 },
    );
  }
}
