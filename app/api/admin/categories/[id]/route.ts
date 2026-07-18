import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  deleteAdminCategory,
  updateAdminCategory,
} from "@/services/category-admin.service";
import { categoryAdminSchema } from "@/validation/admin/category.schema";
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
    const parsed = categoryAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid category data." }, { status: 400 });
    }

    const ok = await updateAdminCategory(id, parsed.data);
    if (!ok) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Could not update category." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const ok = await deleteAdminCategory(id);
    if (!ok) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Could not delete category." },
      { status: 500 },
    );
  }
}
