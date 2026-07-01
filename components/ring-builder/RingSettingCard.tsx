import { Button } from "@/components/ui/Button";
import { DemoImage } from "@/components/ui/DemoImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  DEMO_PLACEHOLDER_IMAGES,
} from "@/constants/demo-images";
import { getCompatibleShapesLabel } from "@/lib/ring-builder";
import { cn, formatLabel } from "@/lib/utils";
import type { RingSettingSummary } from "@/types";
import { Link } from "@/i18n/routing";

interface RingSettingCardProps {
  setting: RingSettingSummary;
  selectHref?: string;
  incompatible?: boolean;
  incompatibleMessage?: string;
}

function ShapeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-sm border border-brand-gold/25 bg-brand-cream px-2 py-0.5 text-xs text-brand-navy">
      {label}
    </span>
  );
}

export function RingSettingCard({
  setting,
  selectHref,
  incompatible = false,
  incompatibleMessage,
}: RingSettingCardProps) {
  const primaryImage =
    setting.images.find((img) => img.isPrimary) ?? setting.images[0];
  const shapes = getCompatibleShapesLabel(setting.compatibleDiamondShapes)
    .split(", ")
    .filter(Boolean);

  return (
    <article
      className={cn(
        "card-luxury flex flex-col overflow-hidden transition-shadow",
        incompatible ? "opacity-60" : "hover:shadow-sm",
      )}
    >
      <div className="relative aspect-square bg-brand-cream">
        <DemoImage
          src={primaryImage?.url}
          fallback={DEMO_PLACEHOLDER_IMAGES.setting}
          alt={primaryImage?.alt ?? setting.name}
          placeholderKind="setting"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {setting.isFeatured && (
          <span className="absolute top-3 left-3 rounded-sm bg-brand-navy/90 px-2 py-1 text-xs font-medium tracking-wide text-brand-gold">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs tracking-[0.2em] text-brand-gold uppercase">
          {formatLabel(setting.style)}
        </p>
        <h3 className="mt-1 font-serif text-lg text-brand-navy">
          {setting.name}
        </h3>
        <PriceDisplay price={setting.basePrice} size="sm" className="mt-2" />

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs tracking-wide text-brand-charcoal/50 uppercase">
              Metals
            </dt>
            <dd className="mt-1 font-medium text-brand-navy">
              {setting.availableMetals.map(formatLabel).join(", ")}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-brand-charcoal/50 uppercase">
              Compatible Shapes
            </dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {shapes.map((shape) => (
                <ShapeChip key={shape} label={shape} />
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-auto pt-5">
          {incompatible ? (
            <p className="text-sm text-red-700/80">
              {incompatibleMessage ??
                "This setting is not compatible with your selected diamond shape."}
            </p>
          ) : selectHref ? (
            <Button href={selectHref} className="w-full">
              Select Setting
            </Button>
          ) : (
            <Link
              href="/create-ring/setting"
              className="inline-flex w-full items-center justify-center rounded-sm border border-brand-gold/40 px-4 py-2.5 text-sm text-brand-navy transition-colors hover:bg-brand-cream"
            >
              View Setting
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
