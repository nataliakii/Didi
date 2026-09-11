import { auth } from "@/auth";
import { isSuperAdmin } from "@/constants/admin-roles";
import { LOCALE_LABELS, type Locale } from "@/constants/i18n";
import {
  getRecentSiteVisits,
  getSiteVisitStats,
} from "@/services/analytics.service";
import { redirect } from "next/navigation";

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Athens",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function localeLabel(code: string): string {
  return LOCALE_LABELS[code as Locale] ?? code.toUpperCase();
}

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id || !isSuperAdmin(session.user.role)) {
    redirect("/admin");
  }

  const [stats, visits] = await Promise.all([
    getSiteVisitStats(),
    getRecentSiteVisits(150),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-stone-900">Site analytics</h2>
        <p className="mt-1 text-sm text-stone-500">
          Super admin only — page visits with IP, language, and path.
        </p>
      </div>

      {!stats.recordingEnabled && (
        <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Recording is off in this environment (local / non-production). The
          table stays empty here on purpose. On production, visits are stored
          automatically.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-stone-200 bg-white p-5">
          <p className="text-xs tracking-widest text-stone-400 uppercase">
            Visits
          </p>
          <p className="mt-2 text-2xl font-medium text-stone-900">
            {stats.total}
          </p>
        </div>
        <div className="rounded-sm border border-stone-200 bg-white p-5">
          <p className="text-xs tracking-widest text-stone-400 uppercase">
            Unique IPs
          </p>
          <p className="mt-2 text-2xl font-medium text-stone-900">
            {stats.uniqueIps}
          </p>
        </div>
        <div className="rounded-sm border border-stone-200 bg-white p-5">
          <p className="text-xs tracking-widest text-stone-400 uppercase">
            Languages
          </p>
          <p className="mt-2 text-sm text-stone-700">
            {stats.byLocale.length === 0
              ? "—"
              : stats.byLocale
                  .map((row) => `${localeLabel(row.locale)} (${row.count})`)
                  .join(" · ")}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
        <div className="border-b border-stone-200 px-4 py-3">
          <h3 className="text-sm font-medium text-stone-900">Recent visits</h3>
        </div>
        {visits.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-stone-500">
            No visits recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs tracking-wide text-stone-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">IP</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Language</th>
                  <th className="px-4 py-3 font-medium">Path</th>
                  <th className="px-4 py-3 font-medium">Visitor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {visits.map((visit) => (
                  <tr key={visit.id} className="align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-stone-700">
                      {formatWhen(visit.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-800">
                      {visit.ip}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {visit.country ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {localeLabel(visit.locale)}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      <span className="break-all">{visit.path}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-stone-500">
                      {visit.visitorId
                        ? `${visit.visitorId.slice(0, 8)}…`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
