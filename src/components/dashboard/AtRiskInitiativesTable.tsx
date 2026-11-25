"use client";

import { AlertTriangle } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useLocalize, useSelectedYear, useStrategyData } from "@/hooks/useStrategy";
import { initiativeProgress, initiativeScore, statusFor } from "@/rules/scoring";
import { ENTER_ROW, staggerDelay } from "@/lib/motion";
import GoldCard from "@/components/common/GoldCard";
import ScoreBar from "@/components/common/ScoreBar";
import StatusBadge from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Initiatives below the "on track" threshold for the selected year, worst first. */
export default function AtRiskInitiativesTable() {
  const t = useTranslations();
  const l = useLocalize();
  const format = useFormatter();
  const year = useSelectedYear();
  const { initiatives, objectives } = useStrategyData();
  const pct = (ratio: number) => format.number(ratio, { style: "percent", maximumFractionDigits: 1 });

  const rows = initiatives
    .map((initiative) => ({ initiative, score: initiativeScore(initiative, year) }))
    .filter(({ score }) => {
      const status = statusFor(score);
      return status === "atRisk" || status === "offTrack";
    })
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

  return (
    <GoldCard bodyClassName="p-0">
      <h2 className="flex items-center gap-2 p-5 pb-3 font-semibold">
        <AlertTriangle className="size-5 text-status-at-risk" />
        {t("dashboard.atRiskInitiatives", { year })}
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="ps-5">{t("columns.initiative")}</TableHead>
            <TableHead>{t("columns.objective")}</TableHead>
            <TableHead>{t("columns.cumulative")}</TableHead>
            <TableHead>{t("columns.score")}</TableHead>
            <TableHead className="pe-5">{t("common.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ initiative, score }, index) => {
            const objective = objectives.find((o) => o.id === initiative.objectiveId);
            const progress = initiativeProgress(initiative, year);
            return (
              <TableRow key={initiative.id} className={ENTER_ROW} style={staggerDelay(index, 30)}>
                <TableCell className="max-w-64 truncate ps-5 font-medium">{l(initiative.name)}</TableCell>
                <TableCell className="max-w-56 truncate text-muted-foreground">
                  {objective ? l(objective.name) : "—"}
                </TableCell>
                <TableCell className="tabular-nums whitespace-nowrap">
                  <span className="font-semibold">{pct(progress.achieved)}</span>
                  <span className="text-xs text-muted-foreground"> / {pct(progress.planned)}</span>
                </TableCell>
                <TableCell><ScoreBar score={score} /></TableCell>
                <TableCell className="pe-5"><StatusBadge status={statusFor(score)} /></TableCell>
              </TableRow>
            );
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                {t("dashboard.noRisks")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </GoldCard>
  );
}
