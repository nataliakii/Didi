import { ChevronRightIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";
import type { AppPathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: AppPathname | `${AppPathname}?${string}`;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  /** Accessible nav label — pass translated string from `breadcrumb.navLabel` */
  navLabel?: string;
}

export function Breadcrumb({
  items,
  className,
  navLabel = "Breadcrumb",
}: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={navLabel}
      className={cn(
        "border-b border-brand-gold/10 bg-brand-ivory/80",
        className,
      )}
    >
      <Container className="py-2">
        <ol className="flex flex-wrap items-center gap-1 text-[11px] tracking-wide text-brand-navy/50">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const label = item.label?.trim() || "…";

            return (
              <li
                key={`${label}-${index}`}
                className="inline-flex items-center gap-1"
              >
                {index > 0 && (
                  <ChevronRightIcon className="h-3 w-3 shrink-0 text-brand-gold/50" />
                )}
                {isLast || !item.href ? (
                  <span
                    className="font-medium text-brand-navy/75"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-brand-gold"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
