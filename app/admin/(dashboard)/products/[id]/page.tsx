import { ProductAdminForm } from "@/components/admin/ProductAdminForm";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatLabel } from "@/lib/utils";
import { getAdminCategoryOptions } from "@/services/category-admin.service";
import { getAdminProductById } from "@/services/product-admin.service";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AdminProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductDetailPage({
  params,
}: AdminProductDetailPageProps) {
  const { id } = await params;
  const [product, categoryOptions] = await Promise.all([
    getAdminProductById(id),
    getAdminCategoryOptions(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="text-xs text-stone-500 hover:text-stone-900"
          >
            &larr; Back to products
          </Link>
          <h2 className="mt-2 text-2xl font-medium text-stone-900">
            {product.name}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {product.sku} · {formatLabel(product.productType)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={product.status} />
          <PriceDisplay price={product.basePrice} salePrice={product.salePrice} />
        </div>
      </div>

      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-medium text-stone-900">Edit product</h3>
        <ProductAdminForm
          productId={product._id}
          categoryOptions={categoryOptions}
          initial={{
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            productType: product.productType,
            categoryId: product.categoryId,
            shortDescription: product.shortDescription ?? "",
            description: product.description ?? "",
            basePrice: product.basePrice,
            salePrice: product.salePrice,
            stockQuantity: product.stockQuantity,
            availabilityStatus: product.availabilityStatus,
            status: product.status,
            isFeatured: product.isFeatured,
            productionTime: product.productionTime ?? "",
            images: product.images?.length
              ? product.images.map((img) => ({
                  url: img.url,
                  alt: img.alt ?? "",
                }))
              : product.imageUrl
                ? [{ url: product.imageUrl, alt: product.imageAlt ?? "" }]
                : [{ url: "", alt: "" }],
            videoUrl: product.videoUrl ?? "",
            seoTitle: product.seoTitle ?? "",
            seoDescription: product.seoDescription ?? "",
            style: product.style ?? "",
            metal: product.metal ?? [],
            goldPurity: product.goldPurity ?? "",
            stoneType: product.stoneType ?? "lab-grown-diamond",
            isLabGrown: product.isLabGrown ?? true,
            diamondShape: product.diamondShape ?? "",
            diamondColor: product.diamondColor ?? "",
            diamondCarat:
              product.diamondCarat != null ? String(product.diamondCarat) : "",
            ringSizes: product.ringSizes?.join(", ") ?? "",
            customSizeAvailable: product.customSizeAvailable ?? true,
            customStoneAvailable: product.customStoneAvailable ?? false,
            shipsTo: product.shipsTo ?? "greece-eu",
            certificationLab: product.certificationLab ?? "",
            certificationReportNumber:
              product.certificationReportNumber ?? "",
            certificationReportUrl: product.certificationReportUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
