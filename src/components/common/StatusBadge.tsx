"use client";

import { useTranslations } from "next-intl";
import type { PerformanceStatus } from "@/domain/strategy";
import { cn } from "@/lib/utils";

export const STATUS_STYLES: Record<
  PerformanceStatus,
  { badge: string; bar: string; color: string }
> = {
  onTrack: {
    badge: "bg-status-on-track/15 text-status-on-track",
    bar: "bg-status-on-track",
    color: "var(--status-on-track)",
  },
  atRisk: {
    badge: "bg-status-at-risk/15 text-status-at-risk",
    bar: "bg-status-at-risk",
    color: "var(--status-at-risk)",
  },
  offTrack: {
    badge: "bg-status-off-track/15 text-status-off-track",
    bar: "bg-status-off-track",
    color: "var(--status-off-track)",
  },
  noData: {
    badge: "bg-status-no-data/15 text-status-no-data",
    bar: "bg-status-no-data",
    color: "var(--status-no-data)",
  },
};

export default function StatusBadge({
  status,
  className,
}: {
  status: PerformanceStatus;
  className?: string;
}) {
  const t = useTranslations("status");
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status].badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", STATUS_STYLES[status].bar)} />
      {t(status)}
    </span>
  );
}
