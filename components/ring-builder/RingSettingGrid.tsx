import type { Locale } from "@/constants/i18n";
import { EmptyState } from "@/components/ui/EmptyState";
import { RingSettingCard } from "@/components/ring-builder/RingSettingCard";
import {
  buildRingDiamondHref,
  buildRingReviewHref,
  isDiamondCompatibleWithSetting,
} from "@/lib/ring-builder";
import type { DiamondDetail, RingSettingSummary } from "@/types";

interface RingSettingGridProps {
  settings: RingSettingSummary[];
  diamondId?: string;
  selectedDiamond?: DiamondDetail | null;
  locale?: Locale;
}

export function RingSettingGrid({
  settings,
  diamondId,
  selectedDiamond,
  locale,
}: RingSettingGridProps) {
  if (settings.length === 0) {
    return (
      <EmptyState
        title="No ring settings found"
        description="Try adjusting your filters to find available settings."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {settings.map((setting) => {
        const incompatible =
          selectedDiamond !== undefined &&
          selectedDiamond !== null &&
          !isDiamondCompatibleWithSetting(setting, selectedDiamond);

        let selectHref: string | undefined;
        if (!incompatible) {
          if (diamondId) {
            selectHref = buildRingReviewHref(
              {
                settingId: setting._id,
                diamondId,
              },
              locale,
            );
          } else {
            selectHref = buildRingDiamondHref({ settingId: setting._id }, locale);
          }
        }

        return (
          <RingSettingCard
            key={setting._id}
            setting={setting}
            selectHref={selectHref}
            incompatible={incompatible}
          />
        );
      })}
    </div>
  );
}
