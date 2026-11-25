import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export type Direction = "ltr" | "rtl";

/** User-entered text kept in both languages. */
export type LocalizedText = Record<Locale, string>;
