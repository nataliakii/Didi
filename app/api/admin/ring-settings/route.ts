import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { createAdminRingSetting } from "@/services/ring-setting-admin.service";
import { ringSettingAdminSchema } from "@/validation/admin/ring-setting.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const body: unknown = await request.json();
    const parsed = ringSettingAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid ring setting data." },
        { status: 400 },
      );
    }

    const id = await createAdminRingSetting(parsed.data);
    if (!id) {
      return NextResponse.json(
        { error: "Could not create ring setting." },
        { status: 500 },
      );
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/ring-settings error:", error);
    return NextResponse.json(
      { error: "Could not create ring setting." },
      { status: 500 },
    );
  }
}
