import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatLabel, formatPrice } from "@/lib/utils";
import { getAdminRingSettings } from "@/services/ring-setting-admin.service";
import Link from "next/link";

export default async function AdminRingSettingsPage() {
  const settings = await getAdminRingSettings();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-stone-900">Ring Settings</h2>
          <p className="mt-1 text-sm text-stone-500">
            Manage ring builder setting options
          </p>
        </div>
        <Link
          href="/admin/ring-settings/new"
          className="rounded-sm bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          New ring setting
        </Link>
      </div>

      {settings.length > 0 ? (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Setting
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Style
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
              {settings.map((setting) => (
                <tr key={setting._id} className="hover:bg-stone-50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/ring-settings/${setting._id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {setting.name}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {setting.compatibleDiamondShapes.length} shapes ·{" "}
                      {setting.availableMetals.length} metals
                    </p>
                  </td>
                  <td className="px-4 py-4 text-stone-700">
                    {formatLabel(setting.style)}
                  </td>
                  <td className="px-4 py-4 text-stone-700">
                    {formatPrice(setting.basePrice)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={setting.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No ring settings found"
          description="Add ring settings for the ring builder flow."
        />
      )}
    </div>
  );
}
