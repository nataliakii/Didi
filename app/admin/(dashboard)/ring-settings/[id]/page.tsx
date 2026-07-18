import { RingSettingAdminForm } from "@/components/admin/RingSettingAdminForm";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatLabel } from "@/lib/utils";
import { getAdminRingSettingById } from "@/services/ring-setting-admin.service";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AdminRingSettingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRingSettingDetailPage({
  params,
}: AdminRingSettingDetailPageProps) {
  const { id } = await params;
  const setting = await getAdminRingSettingById(id);

  if (!setting) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/ring-settings"
            className="text-xs text-stone-500 hover:text-stone-900"
          >
            &larr; Back to ring settings
          </Link>
          <h2 className="mt-2 text-2xl font-medium text-stone-900">
            {setting.name}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {formatLabel(setting.style)} · sizes {setting.minRingSize}–
            {setting.maxRingSize}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={setting.status} />
          <PriceDisplay price={setting.basePrice} />
        </div>
      </div>

      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-medium text-stone-900">
          Edit ring setting
        </h3>
        <RingSettingAdminForm
          settingId={setting._id}
          initial={{
            name: setting.name,
            slug: setting.slug,
            style: setting.style,
            basePrice: setting.basePrice,
            description: setting.description ?? "",
            availableMetals: setting.availableMetals,
            compatibleDiamondShapes: setting.compatibleDiamondShapes,
            minRingSize: setting.minRingSize,
            maxRingSize: setting.maxRingSize,
            productionTime: setting.productionTime ?? "",
            status: setting.status,
            isFeatured: setting.isFeatured,
            imageUrl: setting.imageUrl ?? "",
            videoUrl: setting.videoUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
