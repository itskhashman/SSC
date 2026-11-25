"use client";

import { Flag, Gauge, Layers, Rocket } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useStrategyData, useStrategyScores } from "@/hooks/useStrategy";
import { statusFor } from "@/rules/scoring";
import GoldCard from "@/components/common/GoldCard";
import StatusBadge, { STATUS_STYLES } from "@/components/common/StatusBadge";

export default function OverallScoreCard() {
  const t = useTranslations("dashboard");
  const format = useFormatter();
  const data = useStrategyData();
  const { overall, year } = useStrategyScores();
  const status = statusFor(overall);
  const percent = overall === null ? 0 : overall * 100;

  const counts = [
    { icon: Layers, label: t("perspectivesCount"), value: data.perspectives.length },
    { icon: Flag, label: t("objectivesCount"), value: data.objectives.length },
    { icon: Gauge, label: t("kpisCount"), value: data.kpis.length },
    { icon: Rocket, label: t("initiativesCount"), value: data.initiatives.length },
  ];

  return (
    <GoldCard bodyClassName="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{t("overall", { year })}</p>
          <p className="mt-1 text-5xl font-bold tabular-nums text-primary">
            {overall === null ? "—" : format.number(overall, { style: "percent" })}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent}%`, background: STATUS_STYLES[status].color }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{t("overallHint")}</p>

      <div className="mt-auto grid grid-cols-2 gap-3">
        {counts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
            <Icon className="size-5 text-gold" />
            <div>
              <p className="text-lg font-bold tabular-nums">{format.number(value)}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </GoldCard>
  );
}
