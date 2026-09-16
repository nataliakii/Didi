import { DiamondGrid } from "@/components/diamond/DiamondGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Container } from "@/components/ui/Container";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Link, type AppPathname } from "@/i18n/routing";
import type { DiamondSummary, ProductSummary } from "@/types";
import type { ReactNode } from "react";

export function SeoLandingPage({
  breadcrumb,
  eyebrow,
  title,
  intro,
  sections,
  products,
  diamonds,
  jewelryHeading,
  looseHeading,
  emptyTitle,
  emptyDescription,
  relatedLinks,
}: {
  breadcrumb: Array<{ label: string; href?: AppPathname }>;
  eyebrow?: string;
  title: string;
  intro: string;
  sections?: Array<{ heading: string; body: string }>;
  products: ProductSummary[];
  diamonds?: DiamondSummary[];
  jewelryHeading?: string;
  looseHeading?: string;
  emptyTitle: string;
  emptyDescription: string;
  relatedLinks?: Array<{ label: string; href: AppPathname }>;
}) {
  return (
    <>
      <PageBreadcrumb items={breadcrumb} />
      <Container className="py-12 lg:py-16">
        <header className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p className="text-xs tracking-[0.2em] text-brand-gold uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-serif text-3xl text-brand-text sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70 sm:text-lg">
            {intro}
          </p>
        </header>

        {relatedLinks && relatedLinks.length > 0 && (
          <nav className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm border border-brand-gold/25 px-4 py-2 text-sm text-brand-text transition-colors hover:border-brand-gold/50 hover:bg-brand-cream"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {products.length > 0 && (
          <section className="mt-12">
            {jewelryHeading && (
              <h2 className="mb-6 font-serif text-2xl text-brand-text">
                {jewelryHeading}
              </h2>
            )}
            <ProductGrid products={products} />
          </section>
        )}

        {diamonds && diamonds.length > 0 && (
          <section className="mt-12">
            {looseHeading && (
              <h2 className="mb-6 font-serif text-2xl text-brand-text">
                {looseHeading}
              </h2>
            )}
            <DiamondGrid diamonds={diamonds} />
          </section>
        )}

        {products.length === 0 && (!diamonds || diamonds.length === 0) && (
          <section className="mt-12">
            <EmptyState title={emptyTitle} description={emptyDescription} />
          </section>
        )}

        {sections && sections.length > 0 && (
          <div className="mx-auto mt-16 max-w-3xl space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl text-brand-text">
                  {section.heading}
                </h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-brand-charcoal/65">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

export function ContentArticle({
  breadcrumb,
  title,
  intro,
  children,
  relatedLinks,
}: {
  breadcrumb: Array<{ label: string; href?: AppPathname }>;
  title: string;
  intro: string;
  children: ReactNode;
  relatedLinks?: Array<{ label: string; href: AppPathname }>;
}) {
  return (
    <>
      <PageBreadcrumb items={breadcrumb} />
      <Container className="py-12 lg:py-16">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl text-brand-text sm:text-4xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-brand-charcoal/70">
            {intro}
          </p>
          <div className="mt-10 space-y-8 text-brand-charcoal/70 leading-relaxed">
            {children}
          </div>
          {relatedLinks && relatedLinks.length > 0 && (
            <nav className="mt-12 border-t border-brand-gold/20 pt-8">
              <h2 className="font-serif text-xl text-brand-text">Explore</h2>
              <ul className="mt-4 space-y-2">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-brand-teal underline-offset-2 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </Container>
    </>
  );
}
