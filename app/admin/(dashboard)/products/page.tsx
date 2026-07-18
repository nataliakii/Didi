import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatLabel, formatPrice } from "@/lib/utils";
import { getAdminProducts } from "@/services/product-admin.service";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-stone-900">Products</h2>
          <p className="mt-1 text-sm text-stone-500">
            Manage jewellery products and pricing
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-sm bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          New product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  SKU
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Category
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
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-stone-50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/products/${product._id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {formatLabel(product.productType)}
                      {product.isFeatured ? " · Featured" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-stone-700">{product.sku}</td>
                  <td className="px-4 py-4 text-stone-700">
                    {product.categoryName ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-stone-700">
                    {formatPrice(product.salePrice ?? product.basePrice)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No products found"
          description="Create products to populate your catalog."
        />
      )}
    </div>
  );
}
