import {
  getVivaWebhookVerificationKey,
  isSuccessfulVivaStatus,
} from "@/lib/viva";
import {
  markOrderFailedFromViva,
  markOrderPaidFromViva,
} from "@/services/checkout.service";
import { NextResponse } from "next/server";

/** EventTypeId 1796 = Transaction Payment Created; 1798 = Transaction Failed */
const EVENT_PAYMENT_CREATED = 1796;
const EVENT_PAYMENT_FAILED = 1798;

/**
 * Viva verifies the webhook URL with a GET and expects `{ "Key": "..." }`.
 */
export async function GET() {
  try {
    const key = await getVivaWebhookVerificationKey();
    return NextResponse.json(key);
  } catch (error) {
    console.error("GET /api/webhooks/viva verification error:", error);
    return NextResponse.json(
      { error: "Webhook verification unavailable." },
      { status: 500 },
    );
  }
}

function extractEventData(body: Record<string, unknown>): Record<string, unknown> {
  const eventData = body.EventData ?? body.eventData;
  if (eventData && typeof eventData === "object") {
    return eventData as Record<string, unknown>;
  }
  return body;
}

function readString(data: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return undefined;
}

function readNumber(data: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const eventTypeId =
      readNumber(body, ["EventTypeId", "eventTypeId"]) ??
      readNumber(extractEventData(body), ["EventTypeId", "eventTypeId"]);

    const eventData = extractEventData(body);
    const orderCode = readString(eventData, ["OrderCode", "orderCode"]);
    const transactionId = readString(eventData, [
      "TransactionId",
      "transactionId",
    ]);
    const statusId = readString(eventData, ["StatusId", "statusId"]);

    if (eventTypeId === EVENT_PAYMENT_FAILED && orderCode) {
      await markOrderFailedFromViva(orderCode);
      return NextResponse.json({ ok: true });
    }

    if (eventTypeId === EVENT_PAYMENT_CREATED || isSuccessfulVivaStatus(statusId ?? "")) {
      if (!orderCode || !transactionId) {
        console.error("Viva webhook missing orderCode/transactionId", body);
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const result = await markOrderPaidFromViva({ orderCode, transactionId });
      if (!result.success) {
        console.error("Viva webhook mark paid failed:", result.error);
        // Still 200 so Viva does not retry forever on business mismatches we log.
        return NextResponse.json({ ok: false, error: result.error });
      }

      return NextResponse.json({ ok: true, orderNumber: result.orderNumber });
    }

    return NextResponse.json({ ok: true, ignored: true });
  } catch (error) {
    console.error("POST /api/webhooks/viva error:", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}
