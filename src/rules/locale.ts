import type { Direction, Locale, LocalizedText } from "@/domain/locale";
import { routing } from "@/i18n/routing";

const RTL_LOCALES: Locale[] = ["ar"];

/** How each locale names itself — used by the language toggle. */
export const LOCALE_LABELS: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

export function getDirection(locale: Locale): Direction {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

export function isRtl(locale: Locale): boolean {
  return getDirection(locale) === "rtl";
}

/** Exactly two locales, so the toggle target is whichever is not current. */
export function getAlternateLocale(locale: Locale): Locale {
  return routing.locales.find((candidate) => candidate !== locale) ?? locale;
}

/** Pick the text for the current locale, falling back to the other one. */
export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale] || text[getAlternateLocale(locale)] || "";
}
