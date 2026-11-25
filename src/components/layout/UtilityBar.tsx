"use client";

import { Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import type { Locale } from "@/domain/locale";
import { Link, usePathname } from "@/i18n/navigation";
import { getAlternateLocale, LOCALE_LABELS } from "@/rules/locale";
import { useUiStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** Grey top strip: sidebar toggle, language, font size and theme — as on the SSC site. */
export default function UtilityBar() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { increaseFont, decreaseFont, resetFont } = useUiStore();
  const alternate = getAlternateLocale(locale);

  return (
    <div className="flex h-11 items-center gap-1 bg-topbar px-3 text-sm text-foreground/80 md:px-6">
      <SidebarTrigger aria-label={t("toggleSidebar")} />
      <Separator orientation="vertical" className="mx-1 h-5!" />

      <div className="ms-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={pathname} locale={alternate} />}
          nativeButton={false}
        >
          {LOCALE_LABELS[alternate]}
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5!" />
        <Button variant="ghost" size="icon-sm" onClick={decreaseFont} aria-label={t("fontDecrease")} title={t("fontDecrease")}>
          <span className="text-xs font-bold">A-</span>
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={resetFont} aria-label={t("fontReset")} title={t("fontReset")}>
          <span className="text-sm font-bold">A</span>
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={increaseFont} aria-label={t("fontIncrease")} title={t("fontIncrease")}>
          <span className="text-base font-bold">A+</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5!" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label={t("toggleTheme")}
          title={t("toggleTheme")}
        >
          {/* Both render; CSS picks one so server and client markup match. */}
          <Moon className="dark:hidden" />
          <Sun className="hidden dark:block" />
        </Button>
      </div>
    </div>
  );
}
