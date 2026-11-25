"use client";

import { AlertTriangle, CheckCircle2, Flag, Rocket } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useStrategyData, useStrategyScores } from "@/hooks/useStrategy";
import { initiativeScore, statusFor } from "@/rules/scoring";
import GoldCard from "@/components/common/GoldCard";
import StatusBadge, { STATUS_STYLES } from "@/components/common/StatusBadge";
import { useCountUp } from "@/hooks/useCountUp";

export default function OverallScoreCard() {
  const t = useTranslations("dashboard");
  const format = useFormatter();
  const data = useStrategyData();
  const { overall, year } = useStrategyScores();
  const status = statusFor(overall);
  const percent = overall === null ? 0 : overall * 100;
  // Counts up to the score; the bar below follows the same value.
  const animated = useCountUp(percent);

  const needAttention = data.initiatives.filter((i) => {
    const s = statusFor(initiativeScore(i, year));
    return s === "atRisk" || s === "offTrack";
  }).length;
  const counts = [
    { icon: Flag, label: t("objectivesCount"), value: data.objectives.length },
    { icon: Rocket, label: t("initiativesCount"), value: data.initiatives.length },
    {
      icon: CheckCircle2,
      label: t("completedCount"),
      value: data.initiatives.filter((i) => i.status === "completed").length,
    },
    { icon: AlertTriangle, label: t("needAttentionCount"), value: needAttention },
  ];

  return (
    <GoldCard bodyClassName="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{t("overall", { year })}</p>
          <p className="mt-1 text-5xl font-bold tabular-nums text-primary">
            {overall === null
              ? "—"
              : format.number(Math.round(animated) / 100, { style: "percent" })}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${animated}%`, background: STATUS_STYLES[status].color }}
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
