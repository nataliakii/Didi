import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { createAdminCategory } from "@/services/category-admin.service";
import { categoryAdminSchema } from "@/validation/admin/category.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const body: unknown = await request.json();
    const parsed = categoryAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid category data." }, { status: 400 });
    }

    const id = await createAdminCategory(parsed.data);
    if (!id) {
      return NextResponse.json(
        { error: "Could not create category." },
        { status: 500 },
      );
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { error: "Could not create category." },
      { status: 500 },
    );
  }
}
