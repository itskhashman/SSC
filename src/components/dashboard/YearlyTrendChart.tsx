"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/domain/locale";
import { useSelectedYear, useStrategyData, useStrategyYears } from "@/hooks/useStrategy";
import { isRtl } from "@/rules/locale";
import { overallScore, toPercent } from "@/rules/scoring";
import GoldCard from "@/components/common/GoldCard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/** Overall strategy score for every year; the selected year is highlighted in gold. */
export default function YearlyTrendChart() {
  const t = useTranslations("dashboard");
  const rtl = isRtl(useLocale() as Locale);
  const data = useStrategyData();
  const years = useStrategyYears();
  const selected = useSelectedYear();

  const rows = useMemo(
    () =>
      years.map((year) => ({
        year: String(year),
        score: toPercent(overallScore(data, year)) ?? 0,
      })),
    [data, years],
  );

  const config = { score: { label: t("score"), color: "var(--chart-1)" } } satisfies ChartConfig;

  return (
    <GoldCard>
      <h2 className="mb-4 font-semibold">{t("yearlyTrend")}</h2>
      <ChartContainer config={config} className="aspect-auto h-60 w-full">
        <BarChart data={rows} margin={{ top: 24, left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} reversed={rtl} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            orientation={rtl ? "right" : "left"}
            width={40}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {rows.map((row) => (
              <Cell
                key={row.year}
                fill={row.year === String(selected) ? "var(--gold)" : "var(--chart-1)"}
              />
            ))}
            <LabelList dataKey="score" position="top" formatter={(v) => `${v}%`} className="fill-foreground text-xs" />
          </Bar>
        </BarChart>
      </ChartContainer>
    </GoldCard>
  );
}
