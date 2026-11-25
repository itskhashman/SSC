"use client";

import { Gauge, Rocket } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { SCORING_CONFIG } from "@/config/scoring";
import type { Objective } from "@/domain/strategy";
import { useLocalize, useStrategyScores } from "@/hooks/useStrategy";
import { statusFor } from "@/rules/scoring";
import GoldCard from "@/components/common/GoldCard";
import ScoreBar from "@/components/common/ScoreBar";
import StatusBadge from "@/components/common/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KpisTable from "./KpisTable";
import InitiativesTable from "./InitiativesTable";

/** Selected objective: score breakdown, then its KPIs and initiatives. */
export default function ObjectiveDetail({ objective }: { objective: Objective }) {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const score = useStrategyScores().objectives[objective.id];
  const { kpis: kpiShare, initiatives: initiativeShare } = SCORING_CONFIG.objectiveMix;

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
        <StatusBadge status={statusFor(score?.total ?? null)} />
      </div>

      {/* How the objective score is built — mirrors config/scoring.ts. */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Breakdown
          label={t("columns.kpiScore")}
          share={format.number(kpiShare, { style: "percent" })}
          score={score?.kpis ?? null}
        />
        <Breakdown
          label={t("columns.initiativeScore")}
          share={format.number(initiativeShare, { style: "percent" })}
          score={score?.initiatives ?? null}
        />
        <div className="rounded-lg bg-primary/10 p-3">
          <p className="text-xs font-medium text-primary">{t("columns.score")}</p>
          <ScoreBar score={score?.total ?? null} className="mt-2" />
        </div>
      </div>

      <Tabs defaultValue="initiatives">
        <TabsList>
          <TabsTrigger value="kpis">
            <Gauge /> {t("columns.kpis")}
          </TabsTrigger>
          <TabsTrigger value="initiatives">
            <Rocket /> {t("columns.initiatives")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kpis" className="pt-3">
          <KpisTable objectiveId={objective.id} />
        </TabsContent>
        <TabsContent value="initiatives" className="pt-3">
          <InitiativesTable objectiveId={objective.id} />
        </TabsContent>
      </Tabs>
    </GoldCard>
  );
}

function Breakdown({ label, share, score }: { label: string; share: string; score: number | null }) {
  const t = useTranslations("strategy");
  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <p className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{t("shareOfScore", { share })}</span>
      </p>
      <ScoreBar score={score} className="mt-2" />
    </div>
  );
}
