import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getReportHrefForCertification } from "@/lib/certification";
import { formatLabel, formatPrice } from "@/lib/utils";
import { getAdminDiamonds } from "@/services/diamond-admin.service";
import type { DiamondCertification } from "@/types";
import Link from "next/link";

function getReportSummary(certification?: DiamondCertification): string {
  if (!certification?.lab && !certification?.reportNumber) {
    return "—";
  }

  const parts: string[] = [];
  if (certification.reportNumber) {
    parts.push(`No. ${certification.reportNumber}`);
  }
  if (getReportHrefForCertification(certification)) {
    parts.push("Report link available");
  }

  return parts.length > 0 ? parts.join(" · ") : "—";
}

export default async function AdminDiamondsPage() {
  const diamonds = await getAdminDiamonds();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-stone-900">Diamonds</h2>
          <p className="mt-1 text-sm text-stone-500">
            Manage diamond inventory and grading report details
          </p>
        </div>
        <Link
          href="/admin/diamonds/new"
          className="rounded-sm bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          New diamond
        </Link>
      </div>

      {diamonds.length > 0 ? (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Diamond
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Lab
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Report
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {diamonds.map((diamond) => (
                <tr key={diamond._id} className="hover:bg-stone-50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/diamonds/${diamond._id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {diamond.carat.toFixed(2)} ct {formatLabel(diamond.shape)}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {formatLabel(diamond.diamondType)} · {diamond.color} /{" "}
                      {diamond.clarity}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-stone-700">
                    {diamond.certification?.lab ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-stone-700">
                    {getReportSummary(diamond.certification)}
                  </td>
                  <td className="px-4 py-4 text-stone-700">
                    {formatPrice(diamond.salePrice ?? diamond.price)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      status={diamond.isActive ? "published" : "archived"}
                      label={diamond.isActive ? "Active" : "Inactive"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No diamonds found"
          description="Seed the database or add diamonds to manage grading reports."
        />
      )}
    </div>
  );
}
