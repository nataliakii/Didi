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
      <div className="relative aspect-square bg-brand-ivory">
        <DemoImage
          src={src}
          fallback={fallback}
          alt={`${diamond.carat.toFixed(2)} ct ${formatLabel(diamond.shape)} diamond`}
          placeholderKind="diamond"
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {diamond.certification?.lab && (
          <span className="absolute top-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[9px] tracking-[0.12em] text-brand-text/70 uppercase">
            {diamond.certification.lab}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="text-[9px] tracking-[0.16em] text-brand-gold uppercase sm:text-[10px]">
          {formatLabel(diamond.diamondType)} · {formatLabel(diamond.shape)}
        </p>
        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-sm text-brand-text sm:text-lg">
            {diamond.carat.toFixed(2)} ct
          </h3>
          <PriceDisplay
            price={diamond.price}
            salePrice={diamond.salePrice}
            size="xs"
          />
        </div>
        <p className="mt-0.5 text-[10px] text-brand-charcoal/50">
          {diamond.cut} · {diamond.color} · {diamond.clarity}
        </p>
        <div className="mt-2 hidden sm:block">
          <StatusBadge status={diamond.availabilityStatus} />
        </div>

        <div className="mt-auto pt-3 sm:pt-5">
          {incompatible ? (
            <p className="text-xs text-brand-charcoal/60 sm:text-sm">
              {incompatibleMessage ??
                "This diamond shape is not compatible with your selected setting."}
            </p>
          ) : selectHref ? (
            <Button href={selectHref} className="w-full" size="sm">
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
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-6 xl:grid-cols-3">
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
