import type {
  ClaritySliderGrade,
  ColorSliderGrade,
  CutSliderGrade,
} from "@/lib/diamond-grades";

export const CUT_GRADE_GUIDE: Record<
  CutSliderGrade,
  { title: string; description: string }
> = {
  Fair: {
    title: "Fair",
    description:
      "Acceptable proportions with reduced brilliance compared with higher cut grades.",
  },
  Good: {
    title: "Good",
    description:
      "Well cut with good light return. A balanced choice for value and beauty.",
  },
  "Very Good": {
    title: "Very Good",
    description:
      "Excellent light performance with proportions close to ideal standards.",
  },
  Ideal: {
    title: "Ideal",
    description:
      "Precise proportions that return a high amount of light for exceptional sparkle.",
  },
  "Super Ideal": {
    title: "Super Ideal",
    description:
      "Cut to the most exacting standards. Proportioned to return the maximum possible light.",
  },
};

export const COLOR_GRADE_GUIDE: Record<
  ColorSliderGrade,
  { title: string; description: string }
> = {
  K: {
    title: "K",
    description: "Noticeable warm tint. Often chosen for vintage yellow-gold settings.",
  },
  J: {
    title: "J",
    description: "Slightly detectable color. Attractive value in many settings.",
  },
  I: {
    title: "I",
    description: "Near-colorless with a faint warm tone in larger stones.",
  },
  H: {
    title: "H",
    description: "Near-colorless. Color is difficult to detect to the unaided eye.",
  },
  G: {
    title: "G",
    description: "Near-colorless. Excellent balance of purity and value.",
  },
  F: {
    title: "F",
    description: "Colorless. Only a trained grader can detect faint color.",
  },
  E: {
    title: "E",
    description: "Colorless. Exceptionally rare with virtually no color.",
  },
  D: {
    title: "D",
    description:
      "Absolutely colorless or icy white. The highest color grade—extremely rare and most valuable.",
  },
};

export const CLARITY_GRADE_GUIDE: Record<
  ClaritySliderGrade,
  { title: string; description: string }
> = {
  SI2: {
    title: "SI2",
    description: "Slightly included. Inclusions may be noticeable under close inspection.",
  },
  SI1: {
    title: "SI1",
    description: "Slightly included. Good eye-clean options are often available.",
  },
  VS2: {
    title: "VS2",
    description: "Very slightly included. Inclusions are difficult to see without magnification.",
  },
  VS1: {
    title: "VS1",
    description: "Very slightly included. Minor inclusions visible only under magnification.",
  },
  VVS2: {
    title: "VVS2",
    description: "Very, very slightly included. Extremely difficult to see under 10x.",
  },
  VVS1: {
    title: "VVS1",
    description: "Very, very slightly included. Minute inclusions under magnification.",
  },
  IF: {
    title: "IF",
    description: "Internally Flawless. No internal inclusions; only minor surface characteristics.",
  },
  FL: {
    title: "FL",
    description:
      "Flawless with no internal or external flaws. Extremely rare and valuable.",
  },
};

export const GRADE_TOPIC_COPY = {
  cut: {
    title: "Cut",
    body: "Cut refers to the angles, proportions, depth, width and uniformity of a diamond’s facets. Cut quality determines how a diamond reflects and refracts light — the key to brilliance and fire.",
  },
  color: {
    title: "Color",
    body: "Color is the natural tint visible in a diamond and does not change over time. Colorless diamonds allow more light to pass through than warmer stones, releasing more sparkle and fire.",
  },
  clarity: {
    title: "Clarity",
    body: "Clarity refers to the absence of inclusions and blemishes formed during a diamond’s growth. Graders examine stones under 10x magnification to assign a clarity grade.",
  },
  lwRatio: {
    title: "L:W Ratio",
    body: "The length-to-width ratio compares a diamond’s length to its width (Length ÷ Width) and shows how elongated the stone appears from above. Example: 5.05 mm × 5.00 mm = 1.01.",
  },
} as const;

export const POPULAR_LW_RATIOS: Record<string, string> = {
  Princess: "1.00–1.05",
  Radiant: "1.00–1.05",
  Asscher: "1.00–1.05",
  Cushion: "1.00–1.05",
  "Elongated Cushion": "1.20–1.49",
  Heart: "0.90–1.10",
  Emerald: "1.30–1.40",
  Oval: "1.30–1.70",
  Pear: "1.45–1.75",
  Marquise: "1.75–2.30",
};
