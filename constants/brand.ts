export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "asteria-theme";
export const DEFAULT_THEME: ThemeMode = "light";

/** Shared accents across both themes (≈8% gold / 5% teal / 2% crimson). */
export const BRAND_GOLD = "#D4AA45";
export const BRAND_GOLD_SOFT = "#E5C875";
export const BRAND_TEAL = "#2CB9BE";
export const BRAND_TEAL_SOFT = "#72D5D2";
export const BRAND_CRIMSON = "#7A2435";
export const BRAND_CRIMSON_SOFT = "#A63D50";

export const LIGHT_THEME = {
  bg: "#FAF7F0",
  bgDeep: "#06182B",
  surface: "#FFFFFF",
  surfaceHover: "#F3EEE4",
  text: "#06182B",
  muted: "#5C6B7A",
  border: "#D9CFBE",
  cream: "#F6F0E6",
} as const;

export const DARK_THEME = {
  bg: "#06182B",
  bgDeep: "#020D1A",
  surface: "#10273D",
  surfaceHover: "#17344B",
  text: "#F7F4ED",
  muted: "#A9B5C2",
  border: "#294258",
  cream: "#10273D",
} as const;

export const BRAND_NAME = "Asteria Diamond House";
export const BRAND_SHORT_NAME = "Asteria";
export const BRAND_TAGLINE = "Timeless diamonds, personal stories.";

/** Default (light) semantic exports for non-CSS contexts. */
export const BRAND_BG = LIGHT_THEME.bg;
export const BRAND_BG_DEEP = LIGHT_THEME.bgDeep;
export const BRAND_SURFACE = LIGHT_THEME.surface;
export const BRAND_SURFACE_HOVER = LIGHT_THEME.surfaceHover;
export const BRAND_TEXT = LIGHT_THEME.text;
export const BRAND_TEXT_MUTED = LIGHT_THEME.muted;
export const BRAND_BORDER = LIGHT_THEME.border;

/** @deprecated Use BRAND_BG_DEEP */
export const BRAND_NAVY = BRAND_BG_DEEP;
/** @deprecated Use BRAND_SURFACE_HOVER */
export const BRAND_NAVY_LIGHT = BRAND_SURFACE_HOVER;
/** @deprecated Use BRAND_BG */
export const BRAND_IVORY = BRAND_BG;
/** @deprecated Use LIGHT_THEME.cream / BRAND_SURFACE */
export const BRAND_CREAM = LIGHT_THEME.cream;
/** @deprecated Use BRAND_TEXT */
export const BRAND_CHARCOAL = BRAND_TEXT;

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}
