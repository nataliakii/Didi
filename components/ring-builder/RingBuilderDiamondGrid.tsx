import type { Locale } from "@/constants/i18n";
import { Button } from "@/components/ui/Button";
import { DemoImage } from "@/components/ui/DemoImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  DEMO_PLACEHOLDER_IMAGES,
  getDiamondShapeImage,
} from "@/constants/demo-images";
import {
  buildRingReviewHref,
  buildRingSettingHref,
  isDiamondCompatibleWithSetting,
} from "@/lib/ring-builder";
import { formatLabel } from "@/lib/utils";
import type { DiamondSummary, RingSettingSummary } from "@/types";

interface RingBuilderDiamondGridProps {
  diamonds: DiamondSummary[];
  settingId?: string;
  selectedSetting?: RingSettingSummary | null;
  locale?: Locale;
}


function getDiamondImage(diamond: DiamondSummary): {
  src?: string;
  fallback: string;
} {
  const fromDiamond = diamond.images.find((img) => img.isPrimary) ?? diamond.images[0];
  return {
    src: fromDiamond?.url,
    fallback: getDiamondShapeImage(diamond.shape) ?? DEMO_PLACEHOLDER_IMAGES.diamond,
  };
}

function BuilderDiamondCard({
  diamond,
  selectHref,
  incompatible,
  incompatibleMessage,
}: {
  diamond: DiamondSummary;
  selectHref?: string;
  incompatible?: boolean;
  incompatibleMessage?: string;
}) {
  const { src, fallback } = getDiamondImage(diamond);

  return (
    <article
      className={`card-luxury flex flex-col overflow-hidden transition-shadow ${
        incompatible ? "opacity-60" : "hover:shadow-sm"
      }`}
    >
      <div className="relative aspect-square bg-brand-cream">
        <DemoImage
          src={src}
          fallback={fallback}
          alt={`${diamond.carat.toFixed(2)} ct ${formatLabel(diamond.shape)} diamond`}
          placeholderKind="diamond"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {diamond.certification?.lab && (
          <span className="absolute top-3 left-3 rounded-sm border border-brand-gold/30 bg-white/90 px-2 py-0.5 text-[9px] tracking-[0.15em] text-brand-navy/70 uppercase backdrop-blur-sm">
            {diamond.certification.lab}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-brand-gold uppercase">
              {formatLabel(diamond.diamondType)} · {formatLabel(diamond.shape)}
            </p>
            <h3 className="mt-1 font-serif text-lg text-brand-navy">
              {diamond.carat.toFixed(2)} ct
            </h3>
          </div>
          <PriceDisplay
            price={diamond.price}
            salePrice={diamond.salePrice}
            size="sm"
          />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-[10px] tracking-wide text-brand-charcoal/50 uppercase">
              Cut
            </dt>
            <dd className="font-medium text-brand-navy">{diamond.cut}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-brand-charcoal/50 uppercase">
              Color
            </dt>
            <dd className="font-medium text-brand-navy">{diamond.color}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-brand-charcoal/50 uppercase">
              Clarity
            </dt>
            <dd className="font-medium text-brand-navy">{diamond.clarity}</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-wide text-brand-charcoal/50 uppercase">
              Report
            </dt>
            <dd className="font-medium text-brand-navy">
              {diamond.certification?.reportNumber ?? "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <StatusBadge status={diamond.availabilityStatus} />
        </div>

        <div className="mt-auto pt-5">
          {incompatible ? (
            <p className="text-sm text-brand-charcoal/60">
              {incompatibleMessage ??
                "This diamond shape is not compatible with your selected setting."}
            </p>
          ) : selectHref ? (
            <Button href={selectHref} className="w-full">
              Select Diamond
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function RingBuilderDiamondGrid({
  diamonds,
  settingId,
  selectedSetting,
  locale,
}: RingBuilderDiamondGridProps) {
  if (diamonds.length === 0) {
    return (
      <EmptyState
        title="No diamonds found"
        description="Try adjusting your filters to find compatible diamonds."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {diamonds.map((diamond) => {
        const incompatible =
          selectedSetting !== undefined &&
          selectedSetting !== null &&
          !isDiamondCompatibleWithSetting(selectedSetting, diamond);

        let selectHref: string | undefined;
        if (!incompatible) {
          if (settingId) {
            selectHref = buildRingReviewHref(
              {
                settingId,
                diamondId: diamond._id,
              },
              locale,
            );
          } else {
            selectHref = buildRingSettingHref({ diamondId: diamond._id }, locale);
          }
        }

        return (
          <BuilderDiamondCard
            key={diamond._id}
            diamond={diamond}
            selectHref={selectHref}
            incompatible={incompatible}
          />
        );
      })}
    </div>
  );
}
