"use client";

import Image from "next/image";
import { Flag, LayoutDashboard, Rocket, Target, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import emblem from "@/assets/ssc-emblem.png";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocalize, useStrategyData } from "@/hooks/useStrategy";
import { useStrategyStore } from "@/store/strategyStore";
import { useUiStore } from "@/store/uiStore";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/strategy", key: "strategy", icon: Target },
  { href: "/initiatives", key: "initiatives", icon: Rocket },
] as const;

export default function AppSidebar({ side }: { side: "left" | "right" }) {
  const t = useTranslations();
  const l = useLocalize();
  const pathname = usePathname();
  const router = useRouter();
  const { objectives } = useStrategyData();
  const clearAll = useStrategyStore((s) => s.clearAll);
  const selectedObjectiveId = useUiStore((s) => s.selectedObjectiveId);
  const selectObjective = useUiStore((s) => s.selectObjective);

  const openObjective = (objectiveId: string) => {
    selectObjective(objectiveId);
    router.push("/strategy");
  };

  return (
    <Sidebar side={side} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
              className="hover:bg-transparent"
            >
              <Image
                src={emblem}
                alt=""
                width={32}
                height={32}
                className="size-8! shrink-0 rounded-md"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-semibold">{t("common.appName")}</span>
                <span className="text-xs text-sidebar-foreground/70">
                  {t("common.orgShortName")}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {t("nav.main")}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1.5">
            {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={t(`nav.${key}`)}
                    render={<Link href={href} />}
                    // Larger than the default h-8 / text-sm main menu items.
                    className="h-11 gap-3 px-3 text-base data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground [&_svg]:size-5!"
                  >
                    <Icon />
                    <span>{t(`nav.${key}`)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {t("nav.objectives")}
          </SidebarGroupLabel>
          <SidebarMenu>
            {objectives.map((objective) => (
              <SidebarMenuItem key={objective.id}>
                <SidebarMenuButton
                  tooltip={l(objective.name)}
                  isActive={
                    pathname.startsWith("/strategy") && selectedObjectiveId === objective.id
                  }
                  onClick={() => openObjective(objective.id)}
                >
                  <Flag className="text-gold-light" />
                  <span>{l(objective.name)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ConfirmDialog
              title={t("common.clearData")}
              description={t("common.clearDataConfirm")}
              confirmLabel={t("common.clearData")}
              onConfirm={clearAll}
              trigger={
                <SidebarMenuButton tooltip={t("common.clearData")}>
                  <Trash2 />
                  <span>{t("common.clearData")}</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
