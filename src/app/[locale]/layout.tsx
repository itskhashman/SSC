import type { Metadata } from "next";
import "../globals.css";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import type { Locale } from "@/domain/locale";
import { routing } from "@/i18n/routing";
import { getDirection } from "@/rules/locale";
import AppShell from "@/components/layout/AppShell";
import ThemeProvider from "@/components/common/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages({ locale });
  const dir = getDirection(locale as Locale);

  return (
    // next-themes sets the theme class on <html> before hydration.
    <html
      lang={locale}
      dir={dir}
      className={plexArabic.variable}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <TooltipProvider>
              <AppShell>{children}</AppShell>
              <Toaster position={dir === "rtl" ? "bottom-left" : "bottom-right"} />
            </TooltipProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
