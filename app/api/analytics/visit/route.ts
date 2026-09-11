import {
  extractClientIp,
  extractCountry,
  recordSiteVisit,
} from "@/services/analytics.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    locale?: string;
    path?: string;
    visitorId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const locale = typeof body.locale === "string" ? body.locale : "";
  const path = typeof body.path === "string" ? body.path : "";
  const visitorId =
    typeof body.visitorId === "string" ? body.visitorId : undefined;

  if (!locale || !path) {
    return NextResponse.json(
      { ok: false, error: "locale and path are required" },
      { status: 400 },
    );
  }

  const result = await recordSiteVisit({
    ip: extractClientIp(request.headers),
    locale,
    path,
    referer: request.headers.get("referer") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    country: extractCountry(request.headers),
    visitorId,
  });

  return NextResponse.json({ ok: true, ...result });
}
