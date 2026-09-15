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
        description="MongoDB is unavailable or the catalogue is empty. Whitelist your IP in Atlas, then run npm run seed."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-6 xl:grid-cols-3">
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
