import { buildPageHref } from "@/lib/searchParams";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  searchParams,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {currentPage > 1 && (
        <Link
          href={buildPageHref(params, currentPage - 1)}
          className="rounded-sm border border-brand-gold/30 px-3 py-1.5 text-sm text-brand-charcoal/75 hover:bg-brand-cream/50"
        >
          Previous
        </Link>
      )}

      {pages.map((page, index) => {
        const prev = pages[index - 1];
        const showEllipsis = prev !== undefined && page - prev > 1;

        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-brand-charcoal/45">...</span>}
            <Link
              href={buildPageHref(params, page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-sm",
                page === currentPage
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-brand-gold/30 text-brand-charcoal/75 hover:bg-brand-cream/50",
              )}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={buildPageHref(params, currentPage + 1)}
          className="rounded-sm border border-brand-gold/30 px-3 py-1.5 text-sm text-brand-charcoal/75 hover:bg-brand-cream/50"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
