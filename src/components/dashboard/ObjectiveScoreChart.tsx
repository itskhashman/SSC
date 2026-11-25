"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/domain/locale";
import { useLocalize, useStrategyData, useStrategyScores } from "@/hooks/useStrategy";
import { isRtl } from "@/rules/locale";
import { statusFor, toPercent } from "@/rules/scoring";
import GoldCard from "@/components/common/GoldCard";
import { STATUS_STYLES } from "@/components/common/StatusBadge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/** One bar per objective for the selected year, coloured by score band. */
export default function ObjectiveScoreChart() {
  const t = useTranslations("dashboard");
  const l = useLocalize();
  const rtl = isRtl(useLocale() as Locale);
  const { objectives } = useStrategyData();
  const scores = useStrategyScores();

  const rows = objectives.map((objective) => {
    const score = scores.objectives[objective.id] ?? null;
    return {
      name: l(objective.name),
      score: toPercent(score) ?? 0,
      fill: STATUS_STYLES[statusFor(score)].color,
    };
  });

  const config = {
    score: { label: t("score"), color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <GoldCard>
      <h2 className="mb-4 font-semibold">{t("objectiveScores")}</h2>
      <ChartContainer config={config} className="aspect-auto h-72 w-full">
        <BarChart data={rows} margin={{ top: 24, left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            reversed={rtl}
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            orientation={rtl ? "right" : "left"}
            width={40}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {rows.map((row) => (
              <Cell key={row.name} fill={row.fill} />
            ))}
            <LabelList dataKey="score" position="top" formatter={(v) => `${v}%`} className="fill-foreground text-xs" />
          </Bar>
        </BarChart>
      </ChartContainer>
    </GoldCard>
  );
}
