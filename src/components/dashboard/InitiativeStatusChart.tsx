"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { useFormatter, useTranslations } from "next-intl";
import type { PerformanceStatus } from "@/domain/strategy";
import { useSelectedYear, useStrategyData } from "@/hooks/useStrategy";
import { initiativeScore, statusFor } from "@/rules/scoring";
import GoldCard from "@/components/common/GoldCard";
import { STATUS_STYLES } from "@/components/common/StatusBadge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const ORDER: PerformanceStatus[] = ["onTrack", "atRisk", "offTrack", "noData"];

/** Donut of initiatives by score band for the selected year. */
export default function InitiativeStatusChart() {
  const t = useTranslations();
  const format = useFormatter();
  const { initiatives } = useStrategyData();
  const year = useSelectedYear();

  const counts = ORDER.map((status) => ({
    status,
    label: t(`status.${status}`),
    value: initiatives.filter((i) => statusFor(initiativeScore(i, year)) === status).length,
  }));

  const config = Object.fromEntries(
    ORDER.map((status) => [
      status,
      { label: t(`status.${status}`), color: STATUS_STYLES[status].color },
    ]),
  ) satisfies ChartConfig;

  return (
    <GoldCard bodyClassName="flex h-full flex-col">
      <h2 className="mb-2 font-semibold">{t("dashboard.initiativeStatus", { year })}</h2>
      <ChartContainer config={config} className="mx-auto aspect-square h-56">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
          <Pie data={counts} dataKey="value" nameKey="status" innerRadius={60} strokeWidth={4}>
            {counts.map((row) => (
              <Cell key={row.status} fill={STATUS_STYLES[row.status].color} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                      {format.number(initiatives.length)}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground text-xs">
                      {t("dashboard.initiativesCount")}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="mt-auto grid grid-cols-2 gap-2 pt-4 text-sm">
        {counts.map((row) => (
          <li key={row.status} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: STATUS_STYLES[row.status].color }} />
            <span className="text-muted-foreground">{row.label}</span>
            <span className="ms-auto font-semibold tabular-nums">{format.number(row.value)}</span>
          </li>
        ))}
      </ul>
    </GoldCard>
  );
}
