import { startCheckout } from "@/services/checkout.service";
import { parseCheckoutRequest } from "@/validation/checkout.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = parseCheckoutRequest(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error, fieldErrors: parsed.fieldErrors },
        { status: 400 },
      );
    }

    const result = await startCheckout(parsed.data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
