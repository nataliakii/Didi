import { DemoImage } from "@/components/ui/DemoImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  DEMO_PLACEHOLDER_IMAGES,
} from "@/constants/demo-images";
import { getCompatibleShapesLabel } from "@/lib/ring-builder";
import { formatLabel } from "@/lib/utils";
import type { RingSettingSummary } from "@/types";

interface SelectedSettingSummaryProps {
  setting: RingSettingSummary;
}

export function SelectedSettingSummary({ setting }: SelectedSettingSummaryProps) {
  const primaryImage =
    setting.images.find((img) => img.isPrimary) ?? setting.images[0];

  return (
    <div className="panel-luxury p-4">
      <p className="text-xs tracking-[0.2em] text-brand-gold uppercase">
        Selected Setting
      </p>
      <div className="mt-3 flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-brand-cream">
          <DemoImage
            src={primaryImage?.url}
            fallback={DEMO_PLACEHOLDER_IMAGES.setting}
            alt={setting.name}
            placeholderKind="setting"
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-brand-navy">{setting.name}</h3>
          <p className="text-sm text-brand-charcoal/60">
            {formatLabel(setting.style)}
          </p>
          <PriceDisplay price={setting.basePrice} size="sm" className="mt-1" />
          <p className="mt-2 text-xs text-brand-charcoal/50">
            Compatible: {getCompatibleShapesLabel(setting.compatibleDiamondShapes)}
          </p>
        </div>
      </div>
    </div>
  );
}
