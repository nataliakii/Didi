import { Button } from "@/components/ui/Button";
import { DemoImage } from "@/components/ui/DemoImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDiamondShapeImage } from "@/constants/demo-images";
import { getReportHrefForCertification } from "@/lib/certification";
import { formatLabel } from "@/lib/utils";
import type { DiamondSummary } from "@/types";
import { Link } from "@/i18n/routing";

interface DiamondCardProps {
  diamond: DiamondSummary;
}

export function DiamondCard({ diamond }: DiamondCardProps) {
  const reportHref = getReportHrefForCertification(diamond.certification);
  const primaryImage =
    diamond.images.find((img) => img.isPrimary) ?? diamond.images[0];
  const imageAlt =
    primaryImage?.alt ??
    `${diamond.carat.toFixed(2)} ct ${formatLabel(diamond.shape)} diamond`;

  return (
    <article className="card-luxury flex flex-col overflow-hidden transition-shadow hover:shadow-sm">
      <div className="relative aspect-square bg-brand-cream">
        <DemoImage
          src={primaryImage?.url}
          fallback={getDiamondShapeImage(diamond.shape)}
          alt={imageAlt}
          placeholderKind="diamond"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {diamond.certification?.lab && (
          <span className="absolute top-3 left-3 rounded-sm border border-brand-gold/25 bg-white/95 px-2 py-0.5 text-[9px] font-medium tracking-[0.12em] text-brand-navy/80 uppercase">
            {diamond.certification.lab}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-brand-gold uppercase">
              {formatLabel(diamond.diamondType)} &middot; {formatLabel(diamond.shape)}
            </p>
            <h3 className="mt-1 font-serif text-xl text-brand-navy">
              {diamond.carat.toFixed(2)} ct
            </h3>
          </div>
          <PriceDisplay
            price={diamond.price}
            salePrice={diamond.salePrice}
            size="sm"
          />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
          <div>
            <dt className="text-[10px] tracking-wide text-brand-charcoal/45 uppercase">
              Cut
            </dt>
            <dd className="mt-0.5 font-medium text-brand-navy">{diamond.cut}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-brand-charcoal/45 uppercase">
              Color
            </dt>
            <dd className="mt-0.5 font-medium text-brand-navy">{diamond.color}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-brand-charcoal/45 uppercase">
              Clarity
            </dt>
            <dd className="mt-0.5 font-medium text-brand-navy">
              {diamond.clarity}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-brand-charcoal/45 uppercase">
              Lab
            </dt>
            <dd className="mt-0.5 font-medium text-brand-navy">
              {diamond.certification?.lab ?? "—"}
            </dd>
          </div>
          {diamond.certification?.reportNumber && (
            <div className="col-span-2">
              <dt className="text-[10px] tracking-wide text-brand-charcoal/45 uppercase">
                Report No.
              </dt>
              <dd className="mt-0.5 font-medium text-brand-navy">
                {diamond.certification.reportNumber}
              </dd>
            </div>
          )}
        </dl>

        {reportHref && (
          <a
            href={reportHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-xs font-medium text-brand-gold underline underline-offset-4 hover:text-brand-navy"
          >
            Check official report
          </a>
        )}

        <div className="mt-3">
          <StatusBadge status={diamond.availabilityStatus} />
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          <Button variant="secondary" className="flex-1" disabled>
            Choose for ring builder
          </Button>
          <Link
            href={`/diamonds/${diamond._id}`}
            className="inline-flex flex-1 items-center justify-center rounded-sm border border-brand-gold/40 px-4 py-2.5 text-sm text-brand-navy transition-colors hover:bg-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
