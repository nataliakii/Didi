export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "asteria-theme";
export const DEFAULT_THEME: ThemeMode = "light";

/** Shared accents across both themes (≈8% gold / 5% teal / 2% crimson). */
export const BRAND_GOLD = "#C5A059";
export const BRAND_GOLD_SOFT = "#D4B36E";
export const BRAND_NAVY_HEX = "#0A192F";
export const BRAND_NAVY_MID = "#0F2340";
export const BRAND_NAVY_DEEP = "#07111F";
export const BRAND_IVORY_HEX = "#FDFBF7";
export const BRAND_TEAL = "#2CB9BE";
export const BRAND_TEAL_SOFT = "#72D5D2";
export const BRAND_CRIMSON = "#7A2435";
export const BRAND_CRIMSON_SOFT = "#A63D50";

export const LIGHT_THEME = {
  bg: "#FDFBF7",
  bgDeep: "#0A192F",
  surface: "#FFFFFF",
  surfaceHover: "#F7F1EA",
  text: "#0A192F",
  muted: "#5C6570",
  border: "#E4D9C8",
  cream: "#FDFBF7",
} as const;

export const DARK_THEME = {
  bg: "#0A192F",
  bgDeep: "#07111F",
  surface: "#10233F",
  surfaceHover: "#163052",
  text: "#FDFBF7",
  muted: "#C5BBA8",
  border: "#2A3D55",
  cream: "#10233F",
} as const;

export const BRAND_NAME = "Asteria Diamond House";
export const BRAND_SHORT_NAME = "Asteria";
export const BRAND_TAGLINE = "Follow Your Star";
export const BRAND_POSITIONING =
  "ASTERIA DIAMOND HOUSE — Colored Lab-Grown Diamond Jewelry in Greece";

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
