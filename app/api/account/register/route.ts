import { registerCustomer } from "@/services/customer.service";
import { customerRegisterSchema } from "@/validation/customer.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = customerRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Invalid input.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const result = await registerCustomer(parsed.data);
    if (!result.ok) {
      if (result.error === "duplicate_email") {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Could not create account." },
        { status: 500 },
      );
    }

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/account/register error:", error);
    return NextResponse.json(
      { error: "Could not create account." },
      { status: 500 },
    );
  }
}
