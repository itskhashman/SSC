"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/domain/locale";
import { isRtl } from "@/rules/locale";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import StoreHydrator from "@/components/common/StoreHydrator";
import AppSidebar from "./AppSidebar";
import SiteHeader from "./SiteHeader";
import UtilityBar from "./UtilityBar";

/** Sidebar + top bars shared by every page. */
export default function AppShell({ children }: { children: ReactNode }) {
  const locale = useLocale() as Locale;
  const side = isRtl(locale) ? "right" : "left";

  return (
    <SidebarProvider>
      <StoreHydrator />
      <AppSidebar side={side} />
      <SidebarInset className="min-w-0 bg-background">
        <UtilityBar />
        <SiteHeader />
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
