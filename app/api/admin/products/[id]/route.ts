import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import {
  deleteAdminProduct,
  updateAdminProduct,
} from "@/services/product-admin.service";
import { productAdminSchema } from "@/validation/admin/product.schema";
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
    const parsed = productAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
    }

    const ok = await updateAdminProduct(id, parsed.data);
    if (!ok) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Could not update product." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const ok = await deleteAdminProduct(id);
    if (!ok) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { error: "Could not delete product." },
      { status: 500 },
    );
  }
}
