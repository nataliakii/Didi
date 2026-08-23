/** Brand contact — from Asteria Diamond House business cards */
export const BRAND_CONTACT = {
  /** Primary Greece line (Diana Angelaki) */
  phone: "+30 69 55 66 55 99",
  phoneHref: "tel:+306955665599",
  email: "info@asteriadiamondhouse.com",
  website: "https://www.asteriadiamondhouse.com",
  city: "Thessaloniki",
  country: "Greece",
  /** Fill when the client provides registered company details. */
  legalEntity: "" as string,
  vatNumber: "" as string,
  streetAddress: "" as string,
} as const;

export type BrandPerson = {
  name: string;
  titleKey: "dianaTitle" | "ruslanaTitle";
  phone: string;
  phoneHref: string;
  email: string;
};

export const BRAND_PEOPLE = {
  diana: {
    name: "Diana Angelaki",
    titleKey: "dianaTitle",
    phone: "+30 69 55 66 55 99",
    phoneHref: "tel:+306955665599",
    email: "info@asteriadiamondhouse.com",
  },
  ruslana: {
    name: "Ruslana Kabiyeva",
    titleKey: "ruslanaTitle",
    phone: "+7 701 971 6775",
    phoneHref: "tel:+77019716775",
    email: "info@asteriadiamondhouse.com",
  },
} as const satisfies Record<string, BrandPerson>;

export const BRAND_TEAM = [BRAND_PEOPLE.diana, BRAND_PEOPLE.ruslana] as const;
