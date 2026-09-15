import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types";

interface ProductGridProps {
  products: ProductSummary[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your filters or search terms to find what you're looking for."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
