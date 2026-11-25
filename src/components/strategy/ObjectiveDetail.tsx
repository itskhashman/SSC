"use client";

import { Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Objective } from "@/domain/strategy";
import { useLocalize, useStrategyScores } from "@/hooks/useStrategy";
import { statusFor } from "@/rules/scoring";
import GoldCard from "@/components/common/GoldCard";
import ScoreBar from "@/components/common/ScoreBar";
import StatusBadge from "@/components/common/StatusBadge";
import InitiativesTable from "./InitiativesTable";

/** Selected objective: its score, then its initiatives. */
export default function ObjectiveDetail({ objective }: { objective: Objective }) {
  const t = useTranslations();
  const l = useLocalize();
  const score = useStrategyScores().objectives[objective.id] ?? null;

  return (
    <GoldCard bodyClassName="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{t("strategy.selectedObjective")}</p>
          <h2 className="text-lg font-semibold">{l(objective.name)}</h2>
          {l(objective.description) && (
            <p className="mt-1 text-sm text-muted-foreground">{l(objective.description)}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ScoreBar score={score} className="min-w-48" />
          <StatusBadge status={statusFor(score)} />
        </div>
      </div>

      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Rocket className="size-4 text-gold" /> {t("columns.initiatives")}
      </h3>
      <InitiativesTable objectiveId={objective.id} />
    </GoldCard>
  );
}
