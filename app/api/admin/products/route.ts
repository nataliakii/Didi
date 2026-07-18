import { CATALOG_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { createAdminProduct } from "@/services/product-admin.service";
import { productAdminSchema } from "@/validation/admin/product.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const gate = await requireAdminApi(CATALOG_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const body: unknown = await request.json();
    const parsed = productAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
    }

    const id = await createAdminProduct(parsed.data);
    if (!id) {
      return NextResponse.json(
        { error: "Could not create product." },
        { status: 500 },
      );
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Could not create product." },
      { status: 500 },
    );
  }
}
