import {
  CLARITY_SLIDER_GRADES,
  COLOR_SLIDER_GRADES,
  CUT_SLIDER_GRADES,
  FLUORESCENCE_SLIDER_GRADES,
  type DiamondFilterPreset,
} from "@/constants/jewellery";

export type CutSliderGrade = (typeof CUT_SLIDER_GRADES)[number];
export type ColorSliderGrade = (typeof COLOR_SLIDER_GRADES)[number];
export type ClaritySliderGrade = (typeof CLARITY_SLIDER_GRADES)[number];
export type FluorescenceSliderGrade = (typeof FLUORESCENCE_SLIDER_GRADES)[number];

export function gradesInRange<T extends string>(
  scale: readonly T[],
  min?: string | null,
  max?: string | null,
): T[] {
  if (!min && !max) return [...scale];

  const start = min ? scale.indexOf(min as T) : 0;
  const end = max ? scale.indexOf(max as T) : scale.length - 1;

  if (start === -1 && end === -1) return [...scale];

  const from = Math.min(
    start === -1 ? 0 : start,
    end === -1 ? scale.length - 1 : end,
  );
  const to = Math.max(
    start === -1 ? 0 : start,
    end === -1 ? scale.length - 1 : end,
  );

  return scale.slice(from, to + 1);
}

/** Ideal filter also matches legacy Excellent cut grades. */
export function expandCutGradesForQuery(grades: string[]): string[] {
  const set = new Set(grades);
  if (set.has("Ideal")) set.add("Excellent");
  return [...set];
}

export interface DiamondPresetValues {
  minCut: CutSliderGrade;
  maxCut: CutSliderGrade;
  minColor: ColorSliderGrade;
  maxColor: ColorSliderGrade;
  minClarity: ClaritySliderGrade;
  maxClarity: ClaritySliderGrade;
  minFluorescence?: FluorescenceSliderGrade;
  maxFluorescence?: FluorescenceSliderGrade;
}

export const DIAMOND_PRESET_VALUES: Record<
  DiamondFilterPreset,
  DiamondPresetValues
> = {
  "most-sparkle": {
    minCut: "Ideal",
    maxCut: "Super Ideal",
    minColor: "F",
    maxColor: "D",
    minClarity: "VS1",
    maxClarity: "FL",
  },
  "best-balance": {
    minCut: "Very Good",
    maxCut: "Super Ideal",
    minColor: "H",
    maxColor: "D",
    minClarity: "VS2",
    maxClarity: "FL",
  },
  "top-quality": {
    minCut: "Ideal",
    maxCut: "Super Ideal",
    minColor: "F",
    maxColor: "D",
    minClarity: "VVS2",
    maxClarity: "FL",
    minFluorescence: "Medium",
    maxFluorescence: "None",
  },
};
