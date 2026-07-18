import { DiamondAdminForm } from "@/components/admin/DiamondAdminForm";
import { DiamondCertificationPanel } from "@/components/admin/DiamondCertificationPanel";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DEFAULT_LOCALE } from "@/constants/i18n";
import { localizePath } from "@/lib/i18n";
import { formatLabel } from "@/lib/utils";
import { getAdminDiamondById } from "@/services/diamond-admin.service";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AdminDiamondDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminDiamondDetailPage({
  params,
}: AdminDiamondDetailPageProps) {
  const { id } = await params;
  const diamond = await getAdminDiamondById(id);

  if (!diamond) {
    notFound();
  }

  const primaryImage = diamond.images?.find((img) => img.isPrimary)?.url
    ?? diamond.images?.[0]?.url;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/diamonds"
            className="text-xs text-stone-500 hover:text-stone-900"
          >
            &larr; Back to diamonds
          </Link>
          <h2 className="mt-2 text-2xl font-medium text-stone-900">
            {diamond.carat.toFixed(2)} ct {formatLabel(diamond.shape)} Diamond
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {formatLabel(diamond.diamondType)} · {diamond.color} / {diamond.clarity} /{" "}
            {diamond.cut}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge
            status={diamond.isActive ? "published" : "archived"}
            label={diamond.isActive ? "Active" : "Inactive"}
          />
          <PriceDisplay price={diamond.price} salePrice={diamond.salePrice} />
        </div>
      </div>

      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-medium text-stone-900">Edit diamond</h3>
        <DiamondAdminForm
          diamondId={diamond._id}
          initial={{
            diamondType: diamond.diamondType,
            shape: diamond.shape,
            carat: diamond.carat,
            cut: diamond.cut,
            color: diamond.color,
            clarity: diamond.clarity,
            price: diamond.price,
            salePrice: diamond.salePrice,
            availabilityStatus: diamond.availabilityStatus,
            isActive: diamond.isActive,
            imageUrl: primaryImage,
            videoUrl: diamond.videoUrl,
            certification: diamond.certification,
          }}
        />
      </div>

      <DiamondCertificationPanel
        diamondId={diamond._id}
        certification={diamond.certification}
      />

      <div className="flex gap-3">
        <Button href={localizePath(DEFAULT_LOCALE, `/diamonds/${diamond._id}`)} variant="outline">
          View Public Page
        </Button>
      </div>
    </div>
  );
}
