"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import logo from "@/assets/ssc-logo.png";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", key: "dashboard" },
  { href: "/strategy", key: "strategy" },
  { href: "/initiatives", key: "initiatives" },
] as const;

/** White header with the SSC logo and gold-underlined page links. */
export default function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b bg-card px-4 py-4 md:px-8">
      <Link href="/dashboard" className="shrink-0">
        <Image
          src={logo}
          alt={t("logoAlt")}
          priority
          // The logo text is dark grey, so give it a light plate in dark mode.
          className="h-12 w-auto dark:rounded-lg dark:bg-white dark:p-1.5 md:h-14"
        />
      </Link>

      <nav className="flex items-center gap-1 text-sm md:text-base">
        {LINKS.map(({ href, key }, index) => {
          const active = pathname.startsWith(href);
          return (
            <span key={key} className="flex items-center">
              {index > 0 && <span className="mx-2 text-muted-foreground">|</span>}
              <Link
                href={href}
                className={cn(
                  "border-b-2 pb-1 transition-colors hover:text-primary",
                  active
                    ? "border-gold font-semibold text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {t(key)}
              </Link>
            </span>
          );
        })}
      </nav>
    </header>
  );
}
