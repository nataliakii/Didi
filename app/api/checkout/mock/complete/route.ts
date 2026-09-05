import { isMockVivaOrderCode, isVivaMock } from "@/constants/viva";
import { connectDB } from "@/lib/db";
import { buildMockVivaTransactionId } from "@/lib/viva";
import {
  markOrderFailedFromViva,
  markOrderPaidFromViva,
} from "@/services/checkout.service";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  orderCode: z.string().trim().min(1),
  outcome: z.enum(["paid", "failed"]),
  locale: z.string().trim().min(2).max(5).optional(),
});

export async function POST(request: Request) {
  if (!isVivaMock()) {
    return NextResponse.json(
      { error: "Viva mock checkout is disabled." },
      { status: 403 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mock checkout request." }, { status: 400 });
  }

  const { orderCode, outcome, locale = "en" } = parsed.data;

  if (!isMockVivaOrderCode(orderCode)) {
    return NextResponse.json(
      { error: "Not a mock Viva order code." },
      { status: 400 },
    );
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json(
      { error: "Could not connect to the database." },
      { status: 503 },
    );
  }

  const order = await Order.findOne({ vivaOrderCode: orderCode }).select(
    "orderNumber total currency",
  );
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (outcome === "failed") {
    await markOrderFailedFromViva(orderCode);
    return NextResponse.json({
      redirectUrl: `/${locale}/checkout/failure?s=${encodeURIComponent(orderCode)}`,
    });
  }

  const amountCents = Math.round(order.total * 100);
  const transactionId = buildMockVivaTransactionId(orderCode, amountCents);
  const result = await markOrderPaidFromViva({ orderCode, transactionId });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? "Could not mark order as paid." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    redirectUrl: `/${locale}/checkout/success?s=${encodeURIComponent(orderCode)}&t=${encodeURIComponent(transactionId)}`,
    orderNumber: result.orderNumber,
  });
}
