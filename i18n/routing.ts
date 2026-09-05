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
  localeDetection: true,
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
  | "/checkout/mock"
  | "/checkout/success"
  | "/checkout/failure"
  | "/appointment"
  | "/appointment/success"
  | "/about"
  | "/rings"
  | "/necklaces"
  | "/earrings"
  | "/bracelets"
  | "/colored-lab-grown-diamonds"
  | "/blue-lab-grown-diamonds"
  | "/yellow-lab-grown-diamonds"
  | "/pink-lab-grown-diamonds"
  | "/certification"
  | "/delivery-returns"
  | "/contact"
  | "/guides"
  | "/guides/what-are-lab-grown-diamonds"
  | "/guides/colored-lab-grown-diamonds"
  | "/guides/lab-grown-vs-natural-diamonds"
  | "/guides/how-colored-lab-grown-diamonds-are-created"
  | "/guides/igi-certification"
  | "/guides/how-to-read-a-diamond-certificate"
  | "/guides/diamond-cuts-and-shapes";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type { Locale };
