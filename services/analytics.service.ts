import { SUPPORTED_LOCALES, type Locale } from "@/constants/i18n";
import { safeConnectDB } from "@/lib/db";
import { SiteVisit } from "@/models/SiteVisit";

const BOT_UA =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|embedly|quora|pinterest|redditbot|applebot|semrush|ahrefs|bytespider|gptbot|oai-searchbot|chatgpt-user|claudebot|google-extended/i;

export function shouldRecordSiteVisits(): boolean {
  if (process.env.SITE_ANALYTICS_ENABLED === "false") return false;
  if (process.env.SITE_ANALYTICS_ENABLED === "true") return true;

  // Local / preview: keep analytics empty unless explicitly enabled.
  if (process.env.NODE_ENV !== "production") return false;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (!siteUrl || /localhost|127\.0\.0\.1/i.test(siteUrl)) return false;
  return true;
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 100);
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 100);

  const vercel = headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) return vercel.split(",")[0]?.trim().slice(0, 100) || "unknown";

  return "unknown";
}

export function extractCountry(headers: Headers): string | undefined {
  const candidates = [
    headers.get("x-vercel-ip-country"),
    headers.get("cf-ipcountry"),
  ];
  for (const value of candidates) {
    const code = value?.trim().toUpperCase();
    if (code && code !== "XX" && /^[A-Z]{2}$/.test(code)) return code;
  }
  return undefined;
}

function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export async function recordSiteVisit(input: {
  ip: string;
  locale: string;
  path: string;
  referer?: string;
  userAgent?: string;
  country?: string;
  visitorId?: string;
}): Promise<{ recorded: boolean; reason?: string }> {
  if (!shouldRecordSiteVisits()) {
    return { recorded: false, reason: "disabled" };
  }

  const locale = input.locale.trim().toLowerCase();
  if (!isSupportedLocale(locale)) {
    return { recorded: false, reason: "invalid_locale" };
  }

  let path = input.path.trim() || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return { recorded: false, reason: "ignored_path" };
  }
  path = path.slice(0, 500);

  const userAgent = input.userAgent?.slice(0, 500);
  if (userAgent && BOT_UA.test(userAgent)) {
    return { recorded: false, reason: "bot" };
  }

  const db = await safeConnectDB();
  if (!db) return { recorded: false, reason: "db" };

  try {
    await SiteVisit.create({
      ip: input.ip.slice(0, 100) || "unknown",
      locale,
      path,
      referer: input.referer?.slice(0, 500) || undefined,
      userAgent,
      country: input.country,
      visitorId: input.visitorId?.slice(0, 80) || undefined,
    });
    return { recorded: true };
  } catch (error) {
    console.error("recordSiteVisit error:", error);
    return { recorded: false, reason: "error" };
  }
}

export type SiteVisitRow = {
  id: string;
  ip: string;
  locale: string;
  path: string;
  referer?: string;
  userAgent?: string;
  country?: string;
  visitorId?: string;
  createdAt: string;
};

export type SiteVisitStats = {
  total: number;
  uniqueIps: number;
  byLocale: Array<{ locale: string; count: number }>;
  recordingEnabled: boolean;
};

export async function getSiteVisitStats(): Promise<SiteVisitStats> {
  const recordingEnabled = shouldRecordSiteVisits();
  const empty: SiteVisitStats = {
    total: 0,
    uniqueIps: 0,
    byLocale: [],
    recordingEnabled,
  };

  const db = await safeConnectDB();
  if (!db) return empty;

  try {
    const [total, unique, byLocale] = await Promise.all([
      SiteVisit.countDocuments({}),
      SiteVisit.distinct("ip").then((ips) => ips.length),
      SiteVisit.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$locale", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      total,
      uniqueIps: unique,
      byLocale: byLocale.map((row) => ({
        locale: row._id,
        count: row.count,
      })),
      recordingEnabled,
    };
  } catch (error) {
    console.error("getSiteVisitStats error:", error);
    return empty;
  }
}

export async function getRecentSiteVisits(
  limit = 100,
): Promise<SiteVisitRow[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const rows = await SiteVisit.find({})
      .sort({ createdAt: -1 })
      .limit(Math.min(Math.max(limit, 1), 500))
      .lean();

    return rows.map((row) => ({
      id: String(row._id),
      ip: row.ip as string,
      locale: row.locale as string,
      path: row.path as string,
      referer: row.referer as string | undefined,
      userAgent: row.userAgent as string | undefined,
      country: row.country as string | undefined,
      visitorId: row.visitorId as string | undefined,
      createdAt: new Date(row.createdAt as Date).toISOString(),
    }));
  } catch (error) {
    console.error("getRecentSiteVisits error:", error);
    return [];
  }
}
