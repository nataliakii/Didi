import { quoteShippingRates } from "@/services/shipping.service";
import { parseShippingRatesRequest } from "@/validation/shipping.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = parseShippingRatesRequest(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const result = await quoteShippingRates(parsed.data);

    return NextResponse.json({
      options: result.options,
      source: result.source,
      configured: result.configured,
    });
  } catch (error) {
    console.error("POST /api/shipping/rates error:", error);
    return NextResponse.json(
      { error: "Could not calculate shipping rates. Please try again." },
      { status: 500 },
    );
  }
}
