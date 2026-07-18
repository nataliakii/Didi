import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/constants/i18n";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});

export type AppPathname =
  | "/"
  | "/products"
  | "/diamonds"
  | "/create-ring"
  | "/create-ring/setting"
  | "/create-ring/diamond"
  | "/create-ring/review"
  | "/cart"
  | "/checkout"
  | "/checkout/success"
  | "/checkout/failure"
  | "/appointment"
  | "/appointment/success"
  | "/about";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type { Locale };
