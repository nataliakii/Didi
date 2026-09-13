import { auth } from "@/auth";
import { isCustomer } from "@/constants/admin-roles";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/services/customer.service";
import { customerProfileUpdateSchema } from "@/validation/customer.schema";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !isCustomer(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const profile = await getCustomerProfile(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !isCustomer(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    const parsed = customerProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const result = await updateCustomerProfile(session.user.id, parsed.data);
    if (!result.ok) {
      return NextResponse.json({ error: "Could not update profile." }, { status: 400 });
    }

    const profile = await getCustomerProfile(session.user.id);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("PATCH /api/account/profile error:", error);
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }
}
